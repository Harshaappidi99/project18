"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Coins, Tag, Trophy, Target, Users, Zap, Star } from "lucide-react"
import Image from "next/image"

interface CollectibleCardProps {
  collectible: {
    id: string
    rarity: string
    metadata: string
    listedForSale: boolean
    price?: number | null
    createdAt: Date | string
    match: {
      team1: string
      team2: string
      date: Date | string
    }
  }
  onList?: (id: string) => void
  onBuy?: (id: string) => void
  showBuyButton?: boolean
  index?: number
}

const teamColors: Record<string, { primary: string; secondary: string; accent: string; gradient: string }> = {
  CSK: { primary: '#FFCF00', secondary: '#0066CC', accent: '#FFD700', gradient: 'from-yellow-500 via-yellow-400 to-orange-500' },
  MI: { primary: '#004BA0', secondary: '#D4AF37', accent: '#1E90FF', gradient: 'from-blue-600 via-blue-500 to-blue-400' },
  RCB: { primary: '#EC1C24', secondary: '#000000', accent: '#FFD700', gradient: 'from-red-600 via-red-500 to-red-400' },
  KKR: { primary: '#3A225D', secondary: '#B3A123', accent: '#9B59B6', gradient: 'from-purple-800 via-purple-600 to-purple-500' },
  DC: { primary: '#004C93', secondary: '#EF1B23', accent: '#2980B9', gradient: 'from-blue-700 via-blue-600 to-red-500' },
  SRH: { primary: '#FF822A', secondary: '#000000', accent: '#E74C3C', gradient: 'from-orange-600 via-orange-500 to-orange-400' },
  RR: { primary: '#EA1A85', secondary: '#254AA5', accent: '#FF69B4', gradient: 'from-pink-600 via-pink-500 to-blue-500' },
  GT: { primary: '#1C1C1C', secondary: '#B4A76C', accent: '#F39C12', gradient: 'from-gray-800 via-gray-700 to-yellow-600' },
  PBKS: { primary: '#ED1B24', secondary: '#A7A9AC', accent: '#C0392B', gradient: 'from-red-600 via-red-500 to-gray-400' },
  LSG: { primary: '#A72056', secondary: '#FFCC00', accent: '#8E44AD', gradient: 'from-pink-700 via-pink-600 to-yellow-500' },
}

const rarityStyles: Record<string, { 
  border: string; 
  glow: string; 
  badge: string;
  frame: string;
  shine: string;
  label: string;
}> = {
  legendary: { 
    border: 'border-yellow-400', 
    glow: 'shadow-[0_0_40px_rgba(251,191,36,0.6)]',
    badge: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500',
    frame: 'from-yellow-600 via-amber-400 to-yellow-600',
    shine: 'from-yellow-200/50 via-transparent to-yellow-200/50',
    label: '⭐ LEGENDARY'
  },
  epic: { 
    border: 'border-purple-500', 
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    badge: 'bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600',
    frame: 'from-purple-600 via-violet-400 to-purple-600',
    shine: 'from-purple-200/40 via-transparent to-purple-200/40',
    label: '💎 EPIC'
  },
  rare: { 
    border: 'border-blue-500', 
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    badge: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600',
    frame: 'from-blue-600 via-cyan-400 to-blue-600',
    shine: 'from-blue-200/30 via-transparent to-blue-200/30',
    label: '🔷 RARE'
  },
  common: { 
    border: 'border-gray-500', 
    glow: 'shadow-lg',
    badge: 'bg-gray-600',
    frame: 'from-gray-600 via-gray-400 to-gray-600',
    shine: 'from-gray-200/20 via-transparent to-gray-200/20',
    label: 'COMMON'
  },
}

export function CollectibleCard({ 
  collectible, 
  onList, 
  onBuy, 
  showBuyButton = false,
  index = 0 
}: CollectibleCardProps) {
  const metadata = JSON.parse(collectible.metadata || '{}')
  const style = rarityStyles[collectible.rarity] || rarityStyles.common
  const team1Colors = teamColors[collectible.match.team1] || teamColors.CSK
  const team2Colors = teamColors[collectible.match.team2] || teamColors.MI
  const playerTeamColors = teamColors[metadata.playerTeam] || team1Colors
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -20 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 8,
        rotateX: -5,
        transition: { duration: 0.3 }
      }}
      className="group perspective-1000"
    >
      <div className={`relative w-full aspect-[2.5/3.5] rounded-2xl overflow-hidden ${style.border} border-4 ${style.glow} transform-gpu transition-all duration-300 bg-gradient-to-br from-gray-900 to-black`}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${playerTeamColors.primary}40 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Top Header Bar */}
        <div className={`absolute top-0 left-0 right-0 h-14 bg-gradient-to-r ${style.frame} z-10`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="text-lg font-black text-white drop-shadow-lg">PXVIII</div>
              <div className="text-xs text-white/70">.io</div>
            </div>
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">#{String(index + 1).padStart(3, '0')}</span>
            </div>
          </div>
        </div>

        {/* Player Image Section */}
        <div className="absolute top-14 left-0 right-0 h-[55%] overflow-hidden">
          {/* Team Color Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${playerTeamColors.gradient} opacity-80`} />
          
          {/* Diagonal Stripes */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
          }} />

          {/* Player Image */}
          {metadata.playerImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-40 h-40 mt-4">
                {/* Glow behind player */}
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl scale-110" />
                
                {/* Player image with circular crop */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/50 shadow-2xl">
                  <Image
                    src={metadata.playerImage}
                    alt={metadata.playerName || 'Player'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                
                {/* Ring effect */}
                <div className={`absolute -inset-2 rounded-full border-2 ${style.border} opacity-50 animate-pulse`} />
              </div>
            </div>
          ) : (
            /* Fallback Cricket Graphic */
            <div className="relative w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 100 120" className="w-32 h-36">
                <defs>
                  <linearGradient id={`playerGrad-${collectible.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#cccccc" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="20" r="15" fill={`url(#playerGrad-${collectible.id})`} />
                <path d="M30 40 L50 35 L70 40 L65 85 L55 85 L55 110 L45 110 L45 85 L35 85 Z" fill={`url(#playerGrad-${collectible.id})`} />
                <rect x="70" y="45" width="30" height="8" rx="3" fill="#8B4513" transform="rotate(45 70 45)" />
              </svg>
            </div>
          )}

          {/* Player Name Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3 pt-8">
            {metadata.playerName && (
              <div className="text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-wide drop-shadow-lg">
                  {metadata.playerName}
                </h3>
                {metadata.playerRole && (
                  <p className="text-xs text-gray-300 mt-0.5">{metadata.playerRole}</p>
                )}
              </div>
            )}
          </div>

          {/* Achievement Badge */}
          {metadata.achievement && (
            <div className="absolute top-3 right-3">
              <div className={`px-2 py-1 rounded-lg text-[10px] font-bold text-white ${style.badge} shadow-lg`}>
                {metadata.achievement}
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="absolute bottom-16 left-0 right-0 px-3">
          {/* Match Info */}
          <div className="bg-gray-900/90 backdrop-blur rounded-lg p-2 mb-2 border border-gray-700">
            <div className="flex items-center justify-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg"
                style={{ backgroundColor: team1Colors.primary, color: team1Colors.secondary === '#000000' ? '#fff' : team1Colors.secondary }}
              >
                {collectible.match.team1}
              </div>
              <div className="text-center">
                <span className="text-gray-400 font-bold text-xs">VS</span>
                <p className="text-[10px] text-gray-500">{formatDate(collectible.match.date)}</p>
              </div>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg"
                style={{ backgroundColor: team2Colors.primary, color: team2Colors.secondary === '#000000' ? '#fff' : team2Colors.secondary }}
              >
                {collectible.match.team2}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            <div className="bg-gray-800/90 backdrop-blur rounded-lg p-1.5 text-center border border-gray-700">
              <Trophy className="w-3 h-3 text-yellow-500 mx-auto mb-0.5" />
              <div className="text-sm font-black text-white">#{metadata.rank || '—'}</div>
              <div className="text-[8px] text-gray-400 uppercase">Rank</div>
            </div>
            
            <div className="bg-gray-800/90 backdrop-blur rounded-lg p-1.5 text-center border border-gray-700">
              <Target className="w-3 h-3 text-green-500 mx-auto mb-0.5" />
              <div className="text-sm font-black text-white">{metadata.accuracy || '—'}%</div>
              <div className="text-[8px] text-gray-400 uppercase">Acc</div>
            </div>
            
            <div className="bg-gray-800/90 backdrop-blur rounded-lg p-1.5 text-center border border-gray-700">
              <Users className="w-3 h-3 text-blue-500 mx-auto mb-0.5" />
              <div className="text-[11px] font-black text-white">{metadata.totalParticipants ? (metadata.totalParticipants / 1000).toFixed(1) + 'K' : '—'}</div>
              <div className="text-[8px] text-gray-400 uppercase">Field</div>
            </div>
            
            <div className="bg-gray-800/90 backdrop-blur rounded-lg p-1.5 text-center border border-gray-700">
              <Zap className="w-3 h-3 text-purple-500 mx-auto mb-0.5" />
              <div className="text-sm font-black text-white">{metadata.pointsEarned || '—'}</div>
              <div className="text-[8px] text-gray-400 uppercase">Pts</div>
            </div>
          </div>
        </div>

        {/* Bottom Rarity Bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r ${style.frame}`}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative h-full flex items-center justify-center">
            <div className={`px-6 py-1.5 rounded-full bg-black/50 border ${style.border}`}>
              <span className="text-sm font-black text-white uppercase tracking-widest">
                {style.label}
              </span>
            </div>
          </div>
        </div>

        {/* Sale Badge */}
        {collectible.listedForSale && (
          <div className="absolute top-16 left-2 z-20">
            <Badge variant="warning" className="text-xs animate-pulse shadow-lg">
              <Tag className="w-3 h-3 mr-1" />
              FOR SALE
            </Badge>
          </div>
        )}

        {/* Holographic Shine Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>

        {/* Holographic Pattern for Legendary/Epic */}
        {(collectible.rarity === 'legendary' || collectible.rarity === 'epic') && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay group-hover:opacity-40 transition-opacity"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.15) 3px,
                rgba(255,255,255,0.15) 6px
              )`
            }}
          />
        )}
      </div>

      {/* Action Buttons Below Card */}
      <div className="mt-4">
        {collectible.listedForSale && collectible.price ? (
          <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur rounded-xl p-3 border border-gray-700">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-bold text-white">{collectible.price}</span>
              <span className="text-xs text-gray-400">PXVIIIPD</span>
            </div>
            {showBuyButton && onBuy && (
              <Button size="sm" variant="gold" onClick={() => onBuy(collectible.id)}>
                Buy Now
              </Button>
            )}
          </div>
        ) : (
          onList && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onList(collectible.id)}
            >
              <Tag className="w-4 h-4 mr-2" />
              List for Sale
            </Button>
          )
        )}
      </div>
    </motion.div>
  )
}
