"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, BookOpen, ListMusic, BrainCircuit, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getFavorites, toggleFavorite, type PracticeRecord } from "@/lib/storage"

type Filter = "all" | "expression" | "reading" | "logic"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "expression", label: "表达练习" },
  { key: "reading", label: "朗读练习" },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<PracticeRecord[]>([])
  const [filter, setFilter] = useState<Filter>("all")

  useEffect(() => {
    // Filter out logic practice records (module removed)
    setFavorites(getFavorites().filter((r) => r.type !== "logic"))
  }, [])

  const handleUnfavorite = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
    setFavorites(getFavorites())
  }, [])

  const displayed =
    filter === "all" ? favorites : favorites.filter((r) => r.type === filter)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <Link href="/home?tab=records" className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">收藏夹</h1>
        <div className="w-10" />
      </div>

      {/* Filter chips */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.key
                  ? "bg-morandi-brown text-white"
                  : "bg-secondary text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 space-y-3 pb-8">
        <AnimatePresence>
          {displayed.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              className="relative"
            >
              <Link href={`/records/${r.id}`}>
                <div className="bg-card rounded-2xl p-4 shadow-sm border border-border pr-14 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-morandi-beige flex items-center justify-center flex-shrink-0">
                      <RecordIcon type={r.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-muted-foreground">
                          {typeLabel(r.type)}
                        </span>
                        <ScoreBadge record={r} />
                      </div>
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {r.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {relativeTime(r.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => handleUnfavorite(e, r.id)}
                className="absolute top-3.5 right-10 p-1.5 z-10"
                title="取消收藏"
              >
                <Star className="w-4.5 h-4.5 fill-morandi-tan text-morandi-tan" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {displayed.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Star className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-sm">
              暂无收藏，在练习详情页点击星标即可收藏
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function RecordIcon({ type }: { type: PracticeRecord["type"] }) {
  const cls = "w-5 h-5 text-morandi-brown"
  if (type === "expression") return <BookOpen className={cls} />
  if (type === "reading") return <ListMusic className={cls} />
  return <BrainCircuit className={cls} />
}

function ScoreBadge({ record }: { record: PracticeRecord }) {
  if (record.feedback.kind === "reading") {
    const avg = Math.round(
      (record.feedback.clarity + record.feedback.pace + record.feedback.pause) / 3,
    )
    return <span className="text-xs font-medium text-morandi-brown">{avg}分</span>
  }
  if (record.feedback.kind === "logic") {
    return (
      <span className="text-xs font-medium text-morandi-brown">
        {record.feedback.accuracy}%
      </span>
    )
  }
  return null
}

function typeLabel(type: PracticeRecord["type"]): string {
  if (type === "expression") return "表达练习"
  if (type === "reading") return "朗读练习"
  return "逻辑练习"
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return "刚刚"
  if (min < 60) return `${min} 分钟前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} 小时前`
  const day = Math.floor(hr / 24)
  if (day === 1) return "昨天"
  return `${day} 天前`
}
