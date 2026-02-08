import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const listings = await prisma.collectible.findMany({
      where: { listedForSale: true },
      include: {
        match: {
          select: {
            team1: true,
            team2: true,
            date: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Calculate floor prices
    const legendaryPrices = listings.filter(l => l.rarity === "legendary" && l.price).map(l => l.price!)
    const epicPrices = listings.filter(l => l.rarity === "epic" && l.price).map(l => l.price!)
    const rarePrices = listings.filter(l => l.rarity === "rare" && l.price).map(l => l.price!)
    const commonPrices = listings.filter(l => l.rarity === "common" && l.price).map(l => l.price!)

    const stats = {
      totalListings: listings.length,
      floorPrices: {
        legendary: legendaryPrices.length > 0 ? Math.min(...legendaryPrices) : 0,
        epic: epicPrices.length > 0 ? Math.min(...epicPrices) : 0,
        rare: rarePrices.length > 0 ? Math.min(...rarePrices) : 0,
        common: commonPrices.length > 0 ? Math.min(...commonPrices) : 0,
      },
    }

    return NextResponse.json({ listings, stats })
  } catch (error) {
    console.error("Failed to fetch exchange listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}
