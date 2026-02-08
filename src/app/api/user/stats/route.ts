import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        predictions: true,
        collectibles: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const correctPredictions = user.predictions.filter(p => p.isCorrect === true).length
    const totalPredictions = user.predictions.filter(p => p.isCorrect !== null).length
    const accuracy = totalPredictions > 0 
      ? Math.round((correctPredictions / totalPredictions) * 100) 
      : 0

    return NextResponse.json({
      balance: user.pxviiipd_balance,
      predictions: user.predictions.length,
      accuracy,
      collectibles: user.collectibles.length,
    })
  } catch (error) {
    console.error("Failed to fetch user stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
