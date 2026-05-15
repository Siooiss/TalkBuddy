"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mic, Square } from "lucide-react"

interface RecordButtonProps {
  isRecording: boolean
  onToggle: () => void
  disabled?: boolean
}

export function RecordButton({ isRecording, onToggle, disabled }: RecordButtonProps) {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <AnimatePresence>
        {isRecording && (
          <>
            <motion.span
              key="ring1"
              className="absolute inset-0 rounded-full bg-red-400/25"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              key="ring2"
              className="absolute inset-0 rounded-full bg-red-400/15"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.35 }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isRecording ? "bg-red-400" : "bg-morandi-brown"
        } disabled:opacity-40 disabled:pointer-events-none`}
      >
        {isRecording ? (
          <Square className="w-8 h-8 text-white fill-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </motion.button>
    </div>
  )
}
