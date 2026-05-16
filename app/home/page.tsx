"use client"

import { useState, useRef, useEffect } from "react"
import {
  BookOpen,
  ListMusic,
  BrainCircuit,
  LayoutGrid,
  History,
  ChevronRight,
  Star,
} from "lucide-react"
// BrainCircuit kept for record type icon rendering
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  getCheckInDates,
  getRecentRecords,
  getRecords,
  getFavorites,
  type PracticeRecord,
} from "@/lib/storage"

const WEEK_DAY_NAMES = ["日", "一", "二", "三", "四", "五", "六"]

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function getWeekWindow(): Date[] {
  const today = new Date()
  const days: Date[] = []
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("practice")

  // Restore tab from URL param (e.g. /home?tab=records)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("tab")
      if (param === "records") setActiveTab("records")
    }
  }, [])

  // Keep URL in sync with active tab so browser back returns to the right tab
  useEffect(() => {
    if (typeof window === "undefined") return
    const url = activeTab === "records" ? "/home?tab=records" : "/home"
    window.history.replaceState(null, "", url)
  }, [activeTab])

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/40">
            <Image
              src="/images/logo.png"
              alt="叭叭吧 Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">叭叭吧</h1>
            <p className="text-xs text-muted-foreground">每天进步一点点</p>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 py-2 overflow-auto">
        {activeTab === "practice" && <PracticeTab />}
        {activeTab === "records" && <RecordsTab />}
      </div>

      {/* Bottom nav — 2 tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border">
        <div className="flex justify-around py-3 px-6 max-w-md mx-auto">
          <TabButton
            icon={<LayoutGrid className="w-6 h-6" />}
            label="练习"
            isActive={activeTab === "practice"}
            onClick={() => setActiveTab("practice")}
          />
          <TabButton
            icon={<History className="w-6 h-6" />}
            label="记录"
            isActive={activeTab === "records"}
            onClick={() => setActiveTab("records")}
          />
        </div>
      </div>
    </div>
  )
}

function TabButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-8 py-1 transition-colors ${
        isActive ? "text-morandi-brown" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

// ─── Practice Tab ─────────────────────────────────────────────────────────────

function PracticeTab() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [checkInDates, setCheckInDates] = useState<string[]>([])
  const weekDays = getWeekWindow()

  useEffect(() => {
    setCheckInDates(getCheckInDates())
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const itemWidth = 50
      const containerWidth = scrollRef.current.offsetWidth
      scrollRef.current.scrollLeft =
        7 * itemWidth - containerWidth / 2 + itemWidth / 2
    }
  }, [])

  const isCheckedIn = (d: Date) => checkInDates.includes(toDateKey(d))
  const isToday = (d: Date) => toDateKey(d) === toDateKey(new Date())

  const totalChecked = checkInDates.length
  const totalDays = 30
  const circumference = 2 * Math.PI * 56

  return (
    <div className="space-y-4 pt-2">
      {/* Progress ring */}
      <div className="flex justify-center py-2">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64" cy="64" r="56"
              stroke="currentColor" strokeWidth="8" fill="none"
              className="text-secondary"
            />
            <motion.circle
              cx="64" cy="64" r="56"
              stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
              className="text-morandi-tan"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset:
                  circumference -
                  (Math.min(totalChecked / totalDays, 1) * circumference),
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{totalChecked}</span>
            <span className="text-xs text-muted-foreground">/ {totalDays} 天</span>
          </div>
        </div>
      </div>

      {/* Weekly calendar */}
      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {weekDays.map((date, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center min-w-[46px] py-2 px-1.5 rounded-2xl transition-all ${
              isToday(date)
                ? "bg-morandi-brown text-white"
                : selectedDate.toDateString() === date.toDateString()
                  ? "bg-secondary"
                  : "bg-transparent"
            }`}
          >
            <span
              className={`text-[10px] font-medium ${
                isToday(date) ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {WEEK_DAY_NAMES[date.getDay()]}
            </span>
            <span
              className={`text-sm font-semibold mt-0.5 ${
                isToday(date) ? "text-white" : "text-foreground"
              }`}
            >
              {date.getDate()}
            </span>
            {isCheckedIn(date) && (
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  isToday(date) ? "bg-white" : "bg-morandi-tan"
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Today status */}
      {isCheckedIn(new Date()) ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5"
        >
          <span className="text-emerald-500">✓</span>
          <span className="text-sm font-medium text-emerald-700">
            今日已打卡，继续保持！
          </span>
        </motion.div>
      ) : (
        <div className="flex items-center gap-2 bg-morandi-beige/50 border border-border rounded-2xl px-4 py-2.5">
          <span>🎯</span>
          <span className="text-sm text-muted-foreground">
            今日还未练习，完成一项即可打卡
          </span>
        </div>
      )}

      {/* Practice cards */}
      <h2 className="text-base font-semibold text-foreground px-1 pt-1">
        开始练习
      </h2>
      <div className="space-y-3">
        {[
          {
            href: "/practice/expression",
            Icon: BookOpen,
            title: "表达练习",
            desc: "即兴表达，锻炼语言组织能力",
          },
          {
            href: "/practice/reading",
            Icon: ListMusic,
            title: "朗读练习",
            desc: "文本朗读，提升表达流畅度",
          },
        ].map(({ href, Icon, title, desc }) => (
          <Link key={href} href={href}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-morandi-beige flex items-center justify-center">
                  <Icon className="w-6 h-6 text-morandi-brown" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Records Tab ──────────────────────────────────────────────────────────────

function RecordsTab() {
  const [recent, setRecent] = useState<PracticeRecord[]>([])
  const [stats, setStats] = useState({ total: 0, favorites: 0, checkins: 0 })

  useEffect(() => {
    setRecent(getRecentRecords(3))
    const all = getRecords()
    const fav = getFavorites()
    const ci = getCheckInDates()
    setStats({ total: all.length, favorites: fav.length, checkins: ci.length })
  }, [])

  return (
    <div className="space-y-5 pt-2">
      {/* Stats */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex justify-around">
          {[
            { label: "练习次数", value: stats.total },
            { label: "打卡天数", value: stats.checkins },
            { label: "收藏数量", value: stats.favorites },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="space-y-3">
        <Link href="/records/all">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-morandi-beige flex items-center justify-center">
                <History className="w-6 h-6 text-morandi-brown" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">全部记录</h3>
                <p className="text-xs text-muted-foreground mt-0.5">查看所有练习历史</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        </Link>

        <Link href="/records/favorites">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-morandi-beige flex items-center justify-center">
                <Star className="w-6 h-6 text-morandi-brown" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">收藏夹</h3>
                <p className="text-xs text-muted-foreground mt-0.5">查看已收藏的练习</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Recent 3 */}
      <div>
        <h2 className="text-base font-semibold text-foreground px-1 mb-3">
          最近练习
        </h2>
        {recent.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <p className="text-muted-foreground text-sm">
              完成第一次练习后将显示记录
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {recent.map((r, i) => (
              <Link key={r.id} href={`/records/detail?id=${r.id}`}>
                <div
                  className={`p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors ${
                    i !== recent.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-morandi-beige flex items-center justify-center flex-shrink-0">
                    <RecordIcon type={r.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {r.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {typeLabel(r.type)} · {relativeTime(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {r.isFavorited && (
                      <Star className="w-3.5 h-3.5 fill-morandi-tan text-morandi-tan" />
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function RecordIcon({ type }: { type: PracticeRecord["type"] }) {
  const cls = "w-4 h-4 text-morandi-brown"
  if (type === "expression") return <BookOpen className={cls} />
  if (type === "reading") return <ListMusic className={cls} />
  return <BrainCircuit className={cls} />
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
