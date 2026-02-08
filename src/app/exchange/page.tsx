"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { CollectibleCard } from "@/components/collectible-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Store, 
  Loader2,
  TrendingUp,
  Coins,
  ShoppingCart,
  Filter
} from "lucide-react"

interface Listing {
  id: string
  rarity: string
  metadata: string
  listedForSale: boolean
  price: number
  createdAt: string
  match: {
    team1: string
    team2: string
    date: string
  }
  user: {
    name: string
  }
}

interface MarketStats {
  totalListings: number
  floorPrices: {
    legendary: number
    epic: number
    rare: number
    common: number
  }
}

type RarityFilter = "all" | "legendary" | "epic" | "rare" | "common"

export default function ExchangePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState<string | null>(null)
  const [filter, setFilter] = useState<RarityFilter>("all")
  const [stats, setStats] = useState<MarketStats>({
    totalListings: 0,
    floorPrices: { legendary: 0, epic: 0, rare: 0, common: 0 }
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/exchange")
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuy = async (id: string) => {
    if (!confirm("Are you sure you want to buy this collectible?")) return
    
    setBuying(id)
    try {
      const res = await fetch(`/api/exchange/${id}/buy`, {
        method: "POST",
      })
      if (res.ok) {
        fetchListings()
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to purchase")
      }
    } catch (error) {
      console.error("Failed to buy:", error)
    } finally {
      setBuying(null)
    }
  }

  const filteredListings = filter === "all"
    ? listings
    : listings.filter(l => l.rarity === filter)

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
            <Store className="w-8 h-8 text-blue-500" />
            Collectible Exchange
          </h1>
          <p className="text-gray-400">
            Buy and sell collectible cards from other players
          </p>
        </motion.div>

        {/* Market Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <ShoppingCart className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalListings}</div>
              <div className="text-sm text-gray-400">Active Listings</div>
            </CardContent>
          </Card>
          {[
            { rarity: "legendary", emoji: "👑", color: "text-yellow-500" },
            { rarity: "epic", emoji: "💎", color: "text-purple-500" },
            { rarity: "rare", emoji: "⭐", color: "text-blue-500" },
            { rarity: "common", emoji: "🎴", color: "text-gray-400" },
          ].map((item) => (
            <Card key={item.rarity}>
              <CardContent className="p-4 text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <div className={`text-lg font-bold ${item.color}`}>
                  {stats.floorPrices[item.rarity as keyof typeof stats.floorPrices] || "—"}
                </div>
                <div className="text-xs text-gray-400 capitalize">{item.rarity} Floor</div>
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
              {r === "all" ? "All Cards" : r}
            </Button>
          ))}
        </motion.div>

        {/* Listings */}
        {filteredListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CollectibleCard
                  collectible={listing}
                  showBuyButton
                  onBuy={handleBuy}
                  index={index}
                />
                {/* Seller info */}
                <div className="mt-2 flex items-center justify-between px-2">
                  <span className="text-sm text-gray-400">
                    Seller: {listing.user.name}
                  </span>
                  {buying === listing.id && (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-16 text-center">
              <Store className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Listings Available</h3>
              <p className="text-gray-400">
                {filter === "all" 
                  ? "Check back later for new collectibles on sale!"
                  : `No ${filter} cards listed. Try a different filter.`}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
