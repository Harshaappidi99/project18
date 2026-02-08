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
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const totalEarned = transactions
      .filter(t => t.type === "earned" || t.type === "received")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalSpent = transactions
      .filter(t => t.type === "spent")
      .reduce((sum, t) => sum + t.amount, 0)

    return NextResponse.json({
      balance: user.pxviiipd_balance,
      totalEarned,
      totalSpent,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        createdAt: t.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Failed to fetch wallet:", error)
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 })
  }
}
