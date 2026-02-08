import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PXVIII.io - IPL Fan Engagement Platform",
  description: "Predict, Compete, Collect. The ultimate IPL fan engagement platform for the next generation of cricket fans.",
  keywords: ["IPL", "cricket", "predictions", "fantasy", "collectibles", "NFT"],
  openGraph: {
    title: "PXVIII.io - IPL Fan Engagement Platform",
    description: "Predict, Compete, Collect. The ultimate IPL fan engagement platform.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <Providers>
          {/* Background Effects */}
          <div className="fixed inset-0 z-0">
            {/* Gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
            
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(107, 33, 168, 0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
