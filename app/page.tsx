"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const MESSAGES = ["你好！", "准备好了吗？", "开口练习吧！"]

export default function SplashPage() {
  const router = useRouter()
  const [msgIdx, setMsgIdx] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setInterval(
      () => setMsgIdx((i) => Math.min(i + 1, MESSAGES.length - 1)),
      1300,  // slower message switching
    )
    const t2 = setTimeout(() => {
      clearInterval(t1)
      setLeaving(true)
    }, 3600)
    const t3 = setTimeout(() => router.replace("/home"), 4200)
    return () => {
      clearInterval(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [router])

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 overflow-hidden"
      animate={leaving ? { y: "-100vh" } : { y: 0 }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Logo + speech bubble */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative flex justify-center"
      >
        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIdx}
            initial={{ opacity: 0, y: 8, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.22 }}
            className="absolute -top-[68px] left-1/2 -translate-x-1/2 bg-card border border-border rounded-2xl px-4 py-2.5 shadow-sm whitespace-nowrap z-10"
          >
            <span className="text-sm font-medium text-foreground">
              {MESSAGES[msgIdx]}
            </span>
            {/* Tail */}
            <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 block w-3 h-3 bg-card border-r border-b border-border rotate-45" />
          </motion.div>
        </AnimatePresence>

        {/* Floating logo */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-28 rounded-3xl overflow-hidden shadow-md"
        >
          <Image
            src="/images/logo.png"
            alt="叭叭吧"
            width={112}
            height={112}
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Brand name */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="text-center"
      >
        <h1
          className="text-3xl font-bold tracking-wide"
          style={{ color: "#7a6352" }}
        >
          叭叭吧
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 font-medium">
          TalkBuddy · AI 表达力训练
        </p>
      </motion.div>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-morandi-tan"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
