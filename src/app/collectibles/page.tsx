"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { CollectibleCard } from "@/components/collectible-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutGrid, 
  Loader2,
  Sparkles,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Collectible {
  id: string
  rarity: string
  metadata: string
  listedForSale: boolean
  price?: number | null
  createdAt: string
  match: {
    team1: string
    team2: string
    date: string
  }
}

type RarityFilter = "all" | "legendary" | "epic" | "rare" | "common"

export default function CollectiblesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [collectibles, setCollectibles] = useState<Collectible[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<RarityFilter>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchCollectibles()
    }
  }, [session])

  const fetchCollectibles = async () => {
    try {
      const res = await fetch("/api/collectibles")
      if (res.ok) {
        const data = await res.json()
        setCollectibles(data.collectibles || [])
      }
    } catch (error) {
      console.error("Failed to fetch collectibles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleList = async (id: string) => {
    const price = prompt("Enter listing price in PXVIIIPD:")
    if (!price || isNaN(parseInt(price))) return

    try {
      const res = await fetch(`/api/collectibles/${id}/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: parseInt(price) }),
      })
      if (res.ok) {
        fetchCollectibles()
      }
    } catch (error) {
      console.error("Failed to list collectible:", error)
    }
  }

  const filteredCollectibles = filter === "all" 
    ? collectibles 
    : collectibles.filter(c => c.rarity === filter)

  const rarityStats = {
    legendary: collectibles.filter(c => c.rarity === "legendary").length,
    epic: collectibles.filter(c => c.rarity === "epic").length,
    rare: collectibles.filter(c => c.rarity === "rare").length,
    common: collectibles.filter(c => c.rarity === "common").length,
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            My Collectibles
          </h1>
          <p className="text-gray-400">
            Your collection of earned prediction cards
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { rarity: "legendary", emoji: "👑", color: "from-yellow-500 to-orange-500" },
            { rarity: "epic", emoji: "💎", color: "from-purple-500 to-pink-500" },
            { rarity: "rare", emoji: "⭐", color: "from-blue-500 to-cyan-500" },
            { rarity: "common", emoji: "🎴", color: "from-gray-500 to-gray-600" },
          ].map((item) => (
            <Card key={item.rarity} className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`} />
              <CardContent className="p-4 relative text-center">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="text-2xl font-bold text-white">
                  {rarityStats[item.rarity as keyof typeof rarityStats]}
                </div>
                <div className="text-sm text-gray-400 capitalize">{item.rarity}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          <Filter className="w-5 h-5 text-gray-400" />
          {["all", "legendary", "epic", "rare", "common"].map((r) => (
            <Button
              key={r}
              variant={filter === r ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter(r as RarityFilter)}
              className="capitalize"
            >
              {r === "all" ? "All" : r}
              {r !== "all" && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {rarityStats[r as keyof typeof rarityStats]}
                </Badge>
              )}
            </Button>
          ))}
        </motion.div>

        {/* Collectibles Grid */}
        {filteredCollectibles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {filteredCollectibles.map((collectible, index) => (
              <div key={collectible.id} className="w-full max-w-[280px]">
                <CollectibleCard
                  collectible={collectible}
                  onList={handleList}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-16 text-center">
              <LayoutGrid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === "all" ? "No Collectibles Yet" : `No ${filter} cards`}
              </h3>
              <p className="text-gray-400">
                {filter === "all" 
                  ? "Make predictions and perform well to earn collectible cards!"
                  : "Try a different filter to see more cards."}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
