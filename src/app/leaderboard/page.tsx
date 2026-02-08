"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp,
  Loader2,
  Target,
  LayoutGrid
} from "lucide-react"

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  image?: string
  points: number
  accuracy: number
  collectibles: number
  isCurrentUser: boolean
}

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [session])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard")
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data.leaderboard || [])
        if (session?.user?.id) {
          const currentUser = data.leaderboard.find((e: LeaderboardEntry) => e.isCurrentUser)
          setCurrentUserRank(currentUser || null)
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30"
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30"
      default:
        return "bg-gray-800/50 border-gray-700"
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Season Leaderboard
          </h1>
          <p className="text-gray-400">
            Top predictors of IPL 2026
          </p>
        </motion.div>

        {/* Current User Card (if not in top 10) */}
        {currentUserRank && currentUserRank.rank > 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="border-purple-500/50 bg-purple-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-400">Your Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center font-bold text-2xl text-white">
                    #{currentUserRank.rank}
                  </div>
                  <Avatar className="w-12 h-12 border-2 border-purple-500">
                    <AvatarImage src={currentUserRank.image} />
                    <AvatarFallback>{currentUserRank.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{currentUserRank.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{currentUserRank.points} pts</span>
                      <span>{currentUserRank.accuracy}% accuracy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Predictors</CardTitle>
                <Badge variant="secondary">Season 2026</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-500 border-b border-gray-800">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-5">Player</div>
                    <div className="col-span-2 text-center">
                      <Target className="w-4 h-4 inline" /> Points
                    </div>
                    <div className="col-span-2 text-center">
                      <TrendingUp className="w-4 h-4 inline" /> Accuracy
                    </div>
                    <div className="col-span-2 text-center">
                      <LayoutGrid className="w-4 h-4 inline" /> Cards
                    </div>
                  </div>

                  {/* Rows */}
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl border ${getRankBg(entry.rank)} ${entry.isCurrentUser ? 'ring-2 ring-purple-500' : ''}`}
                    >
                      <div className="col-span-1 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="col-span-5 flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-gray-700">
                          <AvatarImage src={entry.image} />
                          <AvatarFallback>{entry.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{entry.name}</p>
                          {entry.isCurrentUser && (
                            <Badge variant="default" className="text-xs mt-1">You</Badge>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-bold text-white">{entry.points.toLocaleString()}</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className={`font-semibold ${entry.accuracy >= 70 ? 'text-green-400' : entry.accuracy >= 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {entry.accuracy}%
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-purple-400 font-semibold">{entry.collectibles}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No leaderboard data yet. Start predicting!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
