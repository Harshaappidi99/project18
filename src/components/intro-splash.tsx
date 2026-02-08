"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroSplashProps {
  onComplete: () => void
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1300),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(() => onComplete(), 2500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase < 5 && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cinematic Bars */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-16 bg-black z-20"
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-16 bg-black z-20"
            initial={{ y: 64 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Background Grid Zoom */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1, opacity: 0.1 }}
            animate={{ 
              scale: phase >= 3 ? 3 : 1.5, 
              opacity: phase >= 3 ? 0 : 0.15 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Radial Burst */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-gradient-to-r from-purple-500 to-transparent"
                style={{
                  width: '50%',
                  transformOrigin: 'left center',
                  rotate: `${i * 30}deg`,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={phase >= 2 ? { 
                  scaleX: [0, 1, 0], 
                  opacity: [0, 1, 0] 
                } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.03,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Sport Icons Sequence */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Cricket Icon */}
            <AnimatePresence>
              {phase === 1 && (
                <motion.div
                  className="absolute text-9xl"
                  initial={{ scale: 5, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.5, opacity: 0, x: -200 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  🏏
                </motion.div>
              )}
            </AnimatePresence>

            {/* Football Icon */}
            <AnimatePresence>
              {phase === 2 && (
                <motion.div
                  className="absolute text-9xl"
                  initial={{ scale: 5, opacity: 0, rotateY: -90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.5, opacity: 0, x: 200 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  ⚽
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Logo Reveal */}
          <motion.div
            className="relative flex flex-col items-center z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={phase >= 3 ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
          >
            {/* Glowing Ring */}
            <motion.div
              className="absolute w-48 h-48 rounded-full"
              initial={{ scale: 0 }}
              animate={phase >= 3 ? { scale: [0, 1.5, 1.2] } : {}}
              transition={{ duration: 0.6 }}
              style={{
                background: 'conic-gradient(from 0deg, #8B5CF6, #3B82F6, #06B6D4, #8B5CF6)',
                filter: 'blur(20px)',
              }}
            />

            {/* Logo Box */}
            <motion.div
              className="relative w-36 h-36 rounded-3xl overflow-hidden"
              initial={{ rotateY: 180 }}
              animate={phase >= 3 ? { rotateY: 0 } : {}}
              transition={{ type: "spring", damping: 15, delay: 0.1 }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(45deg, #8B5CF6, #3B82F6)',
                    'linear-gradient(90deg, #3B82F6, #06B6D4)',
                    'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                    'linear-gradient(180deg, #8B5CF6, #3B82F6)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Logo Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-5xl font-black text-white"
                  initial={{ scale: 0 }}
                  animate={phase >= 3 ? { scale: 1 } : {}}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  P18
                </motion.span>
              </div>

              {/* Shine sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={phase >= 3 ? { x: '200%' } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              className="mt-6 overflow-hidden"
              initial={{ height: 0 }}
              animate={phase >= 3 ? { height: 'auto' } : {}}
              transition={{ delay: 0.4 }}
            >
              <motion.h1
                className="text-4xl font-black tracking-tight"
                initial={{ y: 40 }}
                animate={phase >= 3 ? { y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  PXVIII.io
                </span>
              </motion.h1>
            </motion.div>

            {/* Tagline */}
            <motion.div
              className="mt-3 flex gap-3 text-gray-400 text-sm font-medium overflow-hidden"
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              {['PREDICT', '•', 'COMPETE', '•', 'COLLECT'].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={word === '•' ? 'text-purple-500' : ''}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Corner Accents */}
          <motion.div
            className="absolute top-20 left-8 w-20 h-20 border-l-2 border-t-2 border-purple-500/50"
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="absolute top-20 right-8 w-20 h-20 border-r-2 border-t-2 border-blue-500/50"
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          />
          <motion.div
            className="absolute bottom-20 left-8 w-20 h-20 border-l-2 border-b-2 border-cyan-500/50"
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          />
          <motion.div
            className="absolute bottom-20 right-8 w-20 h-20 border-r-2 border-b-2 border-purple-500/50"
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          />

          {/* Loading Bar */}
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
