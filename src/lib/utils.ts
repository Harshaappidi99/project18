import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return 'from-yellow-500 to-orange-500'
    case 'epic':
      return 'from-purple-500 to-pink-500'
    case 'rare':
      return 'from-blue-500 to-cyan-500'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

export function getRarityBorder(rarity: string): string {
  switch (rarity) {
    case 'legendary':
      return 'border-yellow-500'
    case 'epic':
      return 'border-purple-500'
    case 'rare':
      return 'border-blue-500'
    default:
      return 'border-gray-500'
  }
}

export const teamColors: Record<string, { primary: string; secondary: string }> = {
  'CSK': { primary: '#FFC107', secondary: '#1976D2' },
  'MI': { primary: '#004BA0', secondary: '#D4AF37' },
  'RCB': { primary: '#EC1C24', secondary: '#000000' },
  'KKR': { primary: '#3A225D', secondary: '#B3A123' },
  'DC': { primary: '#004C93', secondary: '#EF1B23' },
  'SRH': { primary: '#F26522', secondary: '#000000' },
  'PBKS': { primary: '#DD1F2D', secondary: '#A7A9AC' },
  'RR': { primary: '#EA1A85', secondary: '#254AA5' },
  'GT': { primary: '#1C1C1C', secondary: '#B87333' },
  'LSG': { primary: '#A72056', secondary: '#FFCC00' },
}

export function getTeamGradient(team: string): string {
  const colors = teamColors[team]
  if (!colors) return 'from-gray-600 to-gray-800'
  return `from-[${colors.primary}] to-[${colors.secondary}]`
}
