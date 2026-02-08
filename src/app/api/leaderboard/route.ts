import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    const users = await prisma.user.findMany({
      include: {
        predictions: true,
        collectibles: true,
      },
      orderBy: {
        pxviiipd_balance: "desc",
      },
      take: 50,
    })

    const leaderboard = users.map((user, index) => {
      const correctPredictions = user.predictions.filter(p => p.isCorrect === true).length
      const totalPredictions = user.predictions.filter(p => p.isCorrect !== null).length
      const accuracy = totalPredictions > 0 
        ? Math.round((correctPredictions / totalPredictions) * 100) 
        : 0

      const points = user.predictions.reduce((sum, p) => sum + p.points, 0)

      return {
        id: user.id,
        rank: index + 1,
        name: user.name || "Anonymous",
        image: user.image,
        points: points + user.pxviiipd_balance,
        accuracy,
        collectibles: user.collectibles.length,
        isCurrentUser: session?.user?.id === user.id,
      }
    })

    // Sort by points
    leaderboard.sort((a, b) => b.points - a.points)
    
    // Update ranks after sorting
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
