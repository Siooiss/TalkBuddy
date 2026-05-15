"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, BookOpen, ListMusic, BrainCircuit, Sparkles, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { getRecords, toggleFavorite, type PracticeRecord } from "@/lib/storage"
import { diffText } from "@/lib/data/logic-scripts"

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 85 ? "bg-emerald-400" : value >= 70 ? "bg-morandi-tan" : "bg-amber-400"
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

function typeLabel(type: PracticeRecord["type"]): string {
  if (type === "expression") return "表达练习"
  if (type === "reading") return "朗读练习"
  return "逻辑练习"
}

function TypeIcon({ type }: { type: PracticeRecord["type"] }) {
  const cls = "w-5 h-5 text-morandi-brown"
  if (type === "expression") return <BookOpen className={cls} />
  if (type === "reading") return <ListMusic className={cls} />
  return <BrainCircuit className={cls} />
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
  return new Date(iso).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })
}

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [record, setRecord] = useState<PracticeRecord | null | undefined>(undefined)

  useEffect(() => {
    const found = getRecords().find((r) => r.id === id) ?? null
    setRecord(found)
  }, [id])

  const handleToggleFavorite = () => {
    if (!record) return
    toggleFavorite(record.id)
    setRecord((r) => r ? { ...r, isFavorited: !r.isFavorited } : r)
  }

  // Loading
  if (record === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-morandi-tan border-t-transparent animate-spin" />
      </div>
    )
  }

  // Not found
  if (record === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted-foreground">找不到该条记录</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-morandi-brown underline"
        >
          返回
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button type="button" onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">练习详情</h1>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="p-2 -mr-2"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              record.isFavorited
                ? "fill-morandi-tan text-morandi-tan"
                : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Meta card */}
      <div className="px-4 mb-4">
        <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-morandi-beige flex items-center justify-center flex-shrink-0">
            <TypeIcon type={record.type} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground">{typeLabel(record.type)}</p>
            <h2 className="text-sm font-semibold text-foreground truncate">{record.title}</h2>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {relativeTime(record.createdAt)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {record.feedback.kind === "expression" && (
          <ExpressionDetail feedback={record.feedback} />
        )}
        {record.feedback.kind === "reading" && (
          <ReadingDetail feedback={record.feedback} />
        )}
        {record.feedback.kind === "logic" && (
          <LogicDetail transcript={record.transcript} feedback={record.feedback} />
        )}
      </div>
    </div>
  )
}

// ─── Expression ───────────────────────────────────────────────────────────────

function ExpressionDetail({
  feedback,
}: {
  feedback: Extract<PracticeRecord["feedback"], { kind: "expression" }>
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-5 border border-border space-y-3"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-morandi-tan" />
          <h3 className="text-sm font-semibold text-foreground">语音转写文本</h3>
        </div>
        <p className="text-sm text-foreground leading-relaxed bg-secondary/40 rounded-2xl px-4 py-3">
          {feedback.transcript}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-5 border border-border space-y-3"
      >
        <h3 className="text-sm font-semibold text-foreground">AI 发现的问题</h3>
        <ul className="space-y-2">
          {feedback.issues.map((issue, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-4 h-4 mt-0.5 rounded-full bg-amber-100 text-amber-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                !
              </span>
              {issue}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-5 border border-border space-y-3"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-morandi-brown" />
          <h3 className="text-sm font-semibold text-morandi-brown">AI 进阶版文案</h3>
        </div>
        <p className="text-sm text-foreground leading-relaxed bg-morandi-beige/40 rounded-2xl px-4 py-3 border border-morandi-tan/20">
          {feedback.improved}
        </p>
      </motion.div>
    </>
  )
}

// ─── Reading ──────────────────────────────────────────────────────────────────

function ReadingDetail({
  feedback,
}: {
  feedback: Extract<PracticeRecord["feedback"], { kind: "reading" }>
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-5 border border-border space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-morandi-tan" />
          <h3 className="text-sm font-semibold text-foreground">多维评分</h3>
        </div>
        <ScoreBar label="发音清晰度" value={feedback.clarity} />
        <ScoreBar label="语速平稳度" value={feedback.pace} />
        <ScoreBar label="断句准确性" value={feedback.pause} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-5 border border-border space-y-3"
      >
        <h3 className="text-sm font-semibold text-foreground">改进建议</h3>
        <ul className="space-y-2">
          {feedback.suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-4 h-4 mt-0.5 rounded-full bg-morandi-beige flex-shrink-0 flex items-center justify-center text-[10px] font-semibold text-morandi-brown">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  )
}

// ─── Logic ────────────────────────────────────────────────────────────────────

function LogicDetail({
  transcript,
  feedback,
}: {
  transcript: string
  feedback: Extract<PracticeRecord["feedback"], { kind: "logic" }>
}) {
  const diff = diffText(transcript, feedback.original)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-5 border border-border"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">准确率</h3>
          <span
            className={`text-xl font-bold ${
              feedback.accuracy >= 80
                ? "text-emerald-500"
                : feedback.accuracy >= 60
                  ? "text-morandi-brown"
                  : "text-amber-500"
            }`}
          >
            {feedback.accuracy}%
          </span>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              feedback.accuracy >= 80
                ? "bg-emerald-400"
                : feedback.accuracy >= 60
                  ? "bg-morandi-tan"
                  : "bg-amber-400"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${feedback.accuracy}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-5 border border-border space-y-4"
      >
        <h3 className="text-sm font-semibold text-foreground">原文对照</h3>
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">原文</p>
          <p className="text-[15px] text-foreground leading-relaxed">
            {feedback.original}
          </p>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-1.5">你的输入（红色为错误字符）</p>
          <p className="text-[15px] leading-relaxed">
            {diff.map((token, i) =>
              token.correct ? (
                <span key={i} className="text-foreground">{token.char}</span>
              ) : (
                <span key={i} className="text-red-500 bg-red-50 rounded px-0.5">
                  {token.char}
                </span>
              ),
            )}
          </p>
        </div>
      </motion.div>
    </>
  )
}
