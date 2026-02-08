import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId, predictions } = await request.json()

    if (!matchId || !predictions || !Array.isArray(predictions)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Validate total credits = 10
    const totalCredits = predictions.reduce((sum: number, p: { creditsAllocated: number }) => sum + p.creditsAllocated, 0)
    if (totalCredits !== 10) {
      return NextResponse.json({ error: "Total credits must equal 10" }, { status: 400 })
    }

    // Check if match exists and hasn't started
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (new Date(match.date) < new Date() && match.status !== "live") {
      return NextResponse.json({ error: "Match has already started" }, { status: 400 })
    }

    // Check for existing predictions
    const existingPredictions = await prisma.prediction.findMany({
      where: {
        userId: session.user.id,
        matchId,
      },
    })

    if (existingPredictions.length > 0) {
      return NextResponse.json({ error: "You have already submitted predictions for this match" }, { status: 400 })
    }

    // Create predictions
    const userId = session.user.id
    await prisma.prediction.createMany({
      data: predictions.map((p: { subEventId: string; selectedOption: string; creditsAllocated: number }) => ({
        userId: userId!,
        matchId,
        subEventId: p.subEventId,
        selectedOption: p.selectedOption,
        creditsAllocated: p.creditsAllocated,
      })),
    })

    // Deduct 10 PXVIIIPD for making predictions
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pxviiipd_balance: { decrement: 10 },
      },
    })

    // Record transaction
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "spent",
        amount: 10,
        description: `Predictions for ${match.team1} vs ${match.team2}`,
      },
    })

    return NextResponse.json({ message: "Predictions submitted successfully" })
  } catch (error) {
    console.error("Failed to submit predictions:", error)
    return NextResponse.json({ error: "Failed to submit predictions" }, { status: 500 })
  }
}
