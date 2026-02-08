"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet, 
  Loader2,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Gift,
  TrendingUp
} from "lucide-react"

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  createdAt: string
}

interface WalletData {
  balance: number
  totalEarned: number
  totalSpent: number
  transactions: Transaction[]
}

export default function WalletPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletData>({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    transactions: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchWallet()
    }
  }, [session])

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/wallet")
      if (res.ok) {
        const data = await res.json()
        setWallet(data)
      }
    } catch (error) {
      console.error("Failed to fetch wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <ArrowDownRight className="w-5 h-5 text-green-400" />
      case "spent":
        return <ArrowUpRight className="w-5 h-5 text-red-400" />
      case "trade":
        return <RefreshCw className="w-5 h-5 text-blue-400" />
      case "received":
        return <Gift className="w-5 h-5 text-purple-400" />
      default:
        return <Coins className="w-5 h-5 text-yellow-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
      case "received":
        return "text-green-400"
      case "spent":
        return "text-red-400"
      default:
        return "text-white"
    }
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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-yellow-500" />
            My Wallet
          </h1>
          <p className="text-gray-400">
            Manage your PXVIIIPD tokens
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-purple-500/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Available Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      {wallet.balance.toLocaleString()}
                    </span>
                    <span className="text-xl text-yellow-500 font-medium">PXVIIIPD</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Total Earned</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    +{wallet.totalEarned.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400 mb-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm">Total Spent</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    -{wallet.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transaction History</span>
                <Badge variant="secondary">{wallet.transactions.length} transactions</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wallet.transactions.length > 0 ? (
                <div className="space-y-4">
                  {wallet.transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === "earned" || tx.type === "received" 
                          ? "bg-green-500/20" 
                          : tx.type === "spent"
                          ? "bg-red-500/20"
                          : "bg-blue-500/20"
                      }`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{tx.description}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className={`text-lg font-bold ${getTransactionColor(tx.type)}`}>
                        {tx.type === "earned" || tx.type === "received" ? "+" : "-"}
                        {tx.amount.toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
