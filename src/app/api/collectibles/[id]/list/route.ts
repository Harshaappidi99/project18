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
    const { price } = await request.json()

    if (!price || price < 1) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }

    const collectible = await prisma.collectible.findUnique({
      where: { id },
    })

    if (!collectible) {
      return NextResponse.json({ error: "Collectible not found" }, { status: 404 })
    }

    if (collectible.userId !== session.user.id) {
      return NextResponse.json({ error: "Not your collectible" }, { status: 403 })
    }

    await prisma.collectible.update({
      where: { id },
      data: {
        listedForSale: true,
        price,
      },
    })

    return NextResponse.json({ message: "Collectible listed successfully" })
  } catch (error) {
    console.error("Failed to list collectible:", error)
    return NextResponse.json({ error: "Failed to list collectible" }, { status: 500 })
  }
}
