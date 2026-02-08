import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const collectibles = await prisma.collectible.findMany({
      where: { userId: session.user.id },
      include: {
        match: {
          select: {
            team1: true,
            team2: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ collectibles })
  } catch (error) {
    console.error("Failed to fetch collectibles:", error)
    return NextResponse.json({ error: "Failed to fetch collectibles" }, { status: 500 })
  }
}
