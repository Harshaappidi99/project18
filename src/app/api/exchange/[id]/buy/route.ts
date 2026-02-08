import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const collectible = await prisma.collectible.findUnique({
      where: { id },
      include: {
        user: true,
        match: true,
      },
    })

    if (!collectible) {
      return NextResponse.json({ error: "Collectible not found" }, { status: 404 })
    }

    if (!collectible.listedForSale || !collectible.price) {
      return NextResponse.json({ error: "Collectible not for sale" }, { status: 400 })
    }

    if (collectible.userId === session.user.id) {
      return NextResponse.json({ error: "Cannot buy your own collectible" }, { status: 400 })
    }

    // Check buyer balance
    const buyer = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!buyer || buyer.pxviiipd_balance < collectible.price) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Perform transaction
    await prisma.$transaction([
      // Deduct from buyer
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          pxviiipd_balance: { decrement: collectible.price },
        },
      }),
      // Add to seller
      prisma.user.update({
        where: { id: collectible.userId },
        data: {
          pxviiipd_balance: { increment: collectible.price },
        },
      }),
      // Transfer collectible
      prisma.collectible.update({
        where: { id },
        data: {
          userId: session.user.id,
          listedForSale: false,
          price: null,
        },
      }),
      // Record buyer transaction
      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: "spent",
          amount: collectible.price,
          description: `Bought ${collectible.rarity} collectible (${collectible.match.team1} vs ${collectible.match.team2})`,
        },
      }),
      // Record seller transaction
      prisma.transaction.create({
        data: {
          userId: collectible.userId,
          type: "earned",
          amount: collectible.price,
          description: `Sold ${collectible.rarity} collectible (${collectible.match.team1} vs ${collectible.match.team2})`,
        },
      }),
    ])

    return NextResponse.json({ message: "Purchase successful" })
  } catch (error) {
    console.error("Failed to buy collectible:", error)
    return NextResponse.json({ error: "Failed to complete purchase" }, { status: 500 })
  }
}
