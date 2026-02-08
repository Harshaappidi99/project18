"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { MatchCard } from "@/components/match-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Loader2 } from "lucide-react"

interface Match {
  id: string
  team1: string
  team2: string
  date: string
  venue: string
  status: string
  result?: string | null
}

type FilterStatus = "all" | "upcoming" | "live" | "completed"

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>("all")

  useEffect(() => {
    fetchMatches()
  }, [filter])

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const url = filter === "all" 
        ? "/api/matches" 
        : `/api/matches?status=${filter}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setMatches(data.matches || [])
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterButtons: { value: FilterStatus; label: string; emoji: string }[] = [
    { value: "all", label: "All Matches", emoji: "🏏" },
    { value: "upcoming", label: "Upcoming", emoji: "📅" },
    { value: "live", label: "Live", emoji: "🔴" },
    { value: "completed", label: "Completed", emoji: "✅" },
  ]

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
          <h1 className="text-3xl font-bold text-white mb-2">
            IPL Matches 🏏
          </h1>
          <p className="text-gray-400">
            Pick a match and make your predictions
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={filter === btn.value ? "default" : "secondary"}
              onClick={() => setFilter(btn.value)}
              className="flex items-center gap-2"
            >
              <span>{btn.emoji}</span>
              {btn.label}
            </Button>
          ))}
        </motion.div>

        {/* Matches Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : matches.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-16 text-center">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Matches Found</h3>
              <p className="text-gray-400">
                {filter !== "all" 
                  ? `No ${filter} matches at the moment. Try a different filter.`
                  : "No matches available. Check back soon!"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
