"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { MatchCard } from "@/components/match-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Coins, 
  Target, 
  Trophy, 
  LayoutGrid, 
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react"

interface Match {
  id: string
  team1: string
  team2: string
  date: string
  venue: string
  status: string
  result?: string | null
}

interface UserStats {
  balance: number
  predictions: number
  accuracy: number
  collectibles: number
}

interface Activity {
  id: string
  type: string
  description: string
  createdAt: string
  amount?: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [stats, setStats] = useState<UserStats>({ balance: 0, predictions: 0, accuracy: 0, collectibles: 0 })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const [matchesRes, statsRes, activitiesRes] = await Promise.all([
        fetch("/api/matches?status=upcoming&limit=6"),
        fetch("/api/user/stats"),
        fetch("/api/user/activities?limit=5"),
      ])

      if (matchesRes.ok) {
        const data = await matchesRes.json()
        setMatches(data.matches || [])
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      if (activitiesRes.ok) {
        const data = await activitiesRes.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!session) return null

  const statCards = [
    {
      title: "PXVIIIPD Balance",
      value: stats.balance,
      icon: Coins,
      gradient: "from-yellow-500 to-orange-500",
      suffix: "",
    },
    {
      title: "Predictions Made",
      value: stats.predictions,
      icon: Target,
      gradient: "from-purple-500 to-blue-500",
      suffix: "",
    },
    {
      title: "Accuracy",
      value: stats.accuracy,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      suffix: "%",
    },
    {
      title: "Collectibles",
      value: stats.collectibles,
      icon: LayoutGrid,
      gradient: "from-pink-500 to-purple-500",
      suffix: "",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session.user?.name?.split(" ")[0] || "Champion"}! 🏏
          </h1>
          <p className="text-gray-400">
            Ready to make some winning predictions today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    {stat.title === "PXVIIIPD Balance" && (
                      <Badge variant="warning" className="text-xs">💰</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-sm text-gray-400">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Matches */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  Upcoming Matches
                </h2>
                <a href="/matches" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  View All →
                </a>
              </div>

              {matches.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {matches.map((match, index) => (
                    <MatchCard key={match.id} match={match} index={index} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No upcoming matches</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "earned" 
                              ? "bg-green-500/20" 
                              : activity.type === "spent"
                              ? "bg-red-500/20"
                              : "bg-blue-500/20"
                          }`}>
                            {activity.type === "earned" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : activity.type === "spent" ? (
                              <XCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <Target className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {activity.amount && (
                            <span className={`text-sm font-semibold ${
                              activity.type === "earned" ? "text-green-400" : "text-red-400"
                            }`}>
                              {activity.type === "earned" ? "+" : "-"}{activity.amount}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
