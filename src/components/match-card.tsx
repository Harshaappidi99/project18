"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDateTime, teamColors } from "@/lib/utils"

interface MatchCardProps {
  match: {
    id: string
    team1: string
    team2: string
    date: Date | string
    venue: string
    status: string
    result?: string | null
  }
  index?: number
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

export function MatchCard({ match, index = 0 }: MatchCardProps) {
  const team1Colors = teamColors[match.team1] || { primary: '#6B21A8', secondary: '#3B82F6' }
  const team2Colors = teamColors[match.team2] || { primary: '#6B21A8', secondary: '#3B82F6' }
  
  const isUpcoming = match.status === 'upcoming'
  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/matches/${match.id}`}>
        <div className="group relative overflow-hidden rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
          {/* Gradient Background */}
          <div 
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
            style={{
              background: `linear-gradient(135deg, ${team1Colors.primary} 0%, transparent 50%, ${team2Colors.primary} 100%)`
            }}
          />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            {isLive && (
              <Badge variant="destructive" className="animate-pulse">
                🔴 LIVE
              </Badge>
            )}
            {isUpcoming && (
              <Badge variant="default">
                Upcoming
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="secondary">
                Completed
              </Badge>
            )}
          </div>

          <div className="relative p-6">
            {/* Teams */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 text-center">
                <div className="text-4xl mb-2">{teamLogos[match.team1] || '🏏'}</div>
                <h3 className="text-lg font-bold text-white">{match.team1}</h3>
              </div>

              <div className="px-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  VS
                </div>
              </div>

              <div className="flex-1 text-center">
                <div className="text-4xl mb-2">{teamLogos[match.team2] || '🏏'}</div>
                <h3 className="text-lg font-bold text-white">{match.team2}</h3>
              </div>
            </div>

            {/* Match Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDateTime(match.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{match.venue}</span>
              </div>
            </div>

            {/* Result or CTA */}
            {isCompleted && match.result ? (
              <div className="text-sm text-gray-300 bg-gray-800/50 rounded-xl p-3">
                🏆 {match.result}
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-400 font-medium">
                  {isLive ? 'Watch & Predict' : 'Make Predictions'}
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
