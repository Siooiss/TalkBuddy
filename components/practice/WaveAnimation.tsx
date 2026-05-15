"use client"

import { motion } from "framer-motion"

interface WaveAnimationProps {
  isActive: boolean
  bars?: number
  className?: string
}

export function WaveAnimation({ isActive, bars = 12, className = "" }: WaveAnimationProps) {
  if (!isActive) return null

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-morandi-brown"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.07,
            ease: "easeInOut",
          }}
          style={{ height: 32, originY: "50%" }}
        />
      ))}
    </div>
  )
}
