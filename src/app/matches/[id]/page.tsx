"use client"

import { useEffect, useState, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Coins, 
  Loader2,
  Check,
  AlertCircle,
  Trophy
} from "lucide-react"

interface SubEvent {
  id: string
  type: string
  description: string
  options: string
}

interface Match {
  id: string
  team1: string
  team2: string
  date: string
  venue: string
  status: string
  result?: string | null
  subEvents: SubEvent[]
}

interface Prediction {
  subEventId: string
  selectedOption: string
  creditsAllocated: number
}

const teamLogos: Record<string, string> = {
  'CSK': '🦁',
  'MI': '🔵',
  'RCB': '🔴',
  'KKR': '💜',
  'DC': '🔷',
  'SRH': '🧡',
  'PBKS': '❤️',
  'RR': '🩷',
  'GT': '🖤',
  'LSG': '💙',
}

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [match, setMatch] = useState<Match | null>(null)
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const totalCredits = Object.values(predictions).reduce((sum, p) => sum + p.creditsAllocated, 0)
  const isValid = totalCredits === 10 && Object.keys(predictions).length === match?.subEvents.length

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    fetchMatch()
  }, [resolvedParams.id])

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${resolvedParams.id}`)
      if (res.ok) {
        const data = await res.json()
        setMatch(data)
        // Initialize predictions
        const initial: Record<string, Prediction> = {}
        data.subEvents.forEach((se: SubEvent) => {
          initial[se.id] = {
            subEventId: se.id,
            selectedOption: "",
            creditsAllocated: 1,
          }
        })
        setPredictions(initial)
      } else {
        router.push("/matches")
      }
    } catch (error) {
      console.error("Failed to fetch match:", error)
      router.push("/matches")
    } finally {
      setLoading(false)
    }
  }

  const updatePrediction = (subEventId: string, field: keyof Prediction, value: string | number) => {
    setPredictions(prev => ({
      ...prev,
      [subEventId]: {
        ...prev[subEventId],
        [field]: value,
      }
    }))
  }

  const handleSubmit = async () => {
    if (!isValid || !match) return
    
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          predictions: Object.values(predictions),
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push("/dashboard"), 2000)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to submit predictions")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!match) return null

  const matchStarted = new Date(match.date) < new Date()

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/matches" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Matches
        </Link>

        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20" />
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <Badge variant={match.status === "live" ? "destructive" : match.status === "upcoming" ? "default" : "secondary"}>
                    {match.status === "live" ? "🔴 LIVE" : match.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl mb-3">{teamLogos[match.team1] || '🏏'}</div>
                    <h2 className="text-2xl font-bold text-white">{match.team1}</h2>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    VS
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-3">{teamLogos[match.team2] || '🏏'}</div>
                    <h2 className="text-2xl font-bold text-white">{match.team2}</h2>
                  </div>
                </div>

                {/* Match Info */}
                <div className="flex items-center justify-center gap-6 mt-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(match.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {match.venue}
                  </div>
                </div>

                {match.result && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-xl text-center">
                    <Trophy className="w-5 h-5 text-yellow-500 inline mr-2" />
                    <span className="text-white">{match.result}</span>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Credit Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-20 z-40 mb-6"
        >
          <Card className={`border-2 ${totalCredits === 10 ? 'border-green-500/50' : totalCredits > 10 ? 'border-red-500/50' : 'border-purple-500/50'}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coins className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-400">Credits Allocated</p>
                  <p className={`text-2xl font-bold ${totalCredits === 10 ? 'text-green-400' : totalCredits > 10 ? 'text-red-400' : 'text-white'}`}>
                    {totalCredits} / 10
                  </p>
                </div>
              </div>
              {totalCredits === 10 && (
                <Badge variant="success" className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Ready
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Predictions */}
        {matchStarted && match.status !== "live" ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Match Has Already Started</h3>
              <p className="text-gray-400">You cannot make predictions for this match anymore.</p>
            </CardContent>
          </Card>
        ) : success ? (
          <Card>
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Predictions Submitted! 🎉</h3>
              <p className="text-gray-400">Good luck! Check the leaderboard after the match.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Make Your Predictions</h3>
            
            {match.subEvents.map((subEvent, index) => {
              const options = JSON.parse(subEvent.options)
              const prediction = predictions[subEvent.id]
              
              return (
                <motion.div
                  key={subEvent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subEvent.description}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Credits:</span>
                          <select
                            value={prediction?.creditsAllocated || 1}
                            onChange={(e) => updatePrediction(subEvent.id, "creditsAllocated", parseInt(e.target.value))}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-sm"
                          >
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {subEvent.type.includes("slider") || subEvent.type === "total_score" ? (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={options.min || 0}
                            max={options.max || 500}
                            step={options.step || 10}
                            value={prediction?.selectedOption || options.default || 150}
                            onChange={(e) => updatePrediction(subEvent.id, "selectedOption", e.target.value)}
                            className="w-full accent-purple-500"
                          />
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>{options.min || 0}</span>
                            <span className="text-white font-semibold">
                              {prediction?.selectedOption || options.default || 150}
                            </span>
                            <span>{options.max || 500}</span>
                          </div>
                        </div>
                      ) : subEvent.type.includes("range") ? (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {options.map((opt: string) => (
                            <button
                              key={opt}
                              onClick={() => updatePrediction(subEvent.id, "selectedOption", opt)}
                              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                prediction?.selectedOption === opt
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : subEvent.type.includes("radio") || subEvent.type === "winner" || subEvent.type === "first_wicket" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {options.map((opt: string) => (
                            <button
                              key={opt}
                              onClick={() => updatePrediction(subEvent.id, "selectedOption", opt)}
                              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                prediction?.selectedOption === opt
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <select
                          value={prediction?.selectedOption || ""}
                          onChange={(e) => updatePrediction(subEvent.id, "selectedOption", e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
                        >
                          <option value="">Select an option</option>
                          {options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              size="lg"
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Predictions
                  <Coins className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            
            {!isValid && (
              <p className="text-center text-sm text-gray-400">
                {totalCredits !== 10 
                  ? `Allocate exactly 10 credits (currently ${totalCredits})`
                  : "Complete all predictions to submit"}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
