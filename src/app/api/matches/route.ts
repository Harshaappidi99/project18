import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    const where = status && status !== "all" ? { status } : {}

    const matches = await prisma.match.findMany({
      where,
      orderBy: { date: "asc" },
      take: limit,
      include: {
        subEvents: true,
      },
    })

    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Failed to fetch matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}
