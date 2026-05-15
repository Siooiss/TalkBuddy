"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp, CheckCircle2 } from "lucide-react"
import type { AIFeedback } from "@/lib/storage"

interface AIFeedbackCardProps {
  feedback: AIFeedback
  /** Called when user wants to retry the practice */
  onRetry: () => void
  /** True when the record has been saved (auto-save sets this immediately) */
  saved: boolean
  /** Legacy: kept for API compatibility but not used when saved=true */
  onSave?: () => void
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 85
      ? "bg-emerald-400"
      : value >= 70
        ? "bg-morandi-tan"
        : value > 0
          ? "bg-amber-400"
          : "bg-muted"
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${value === 0 ? "text-muted-foreground" : "text-foreground"}`}>
          {value === 0 ? "—" : value}
        </span>
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

export function AIFeedbackCard({ feedback, onRetry, saved, onSave }: AIFeedbackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card rounded-3xl p-5 shadow-sm border border-border space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-morandi-beige flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-morandi-tan" />
          </div>
          <span className="text-sm font-semibold text-foreground">AI 反馈</span>
        </div>
        {saved && (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">已自动保存</span>
          </div>
        )}
      </div>

      {/* ── Expression feedback ─────────────────────────────────────────────── */}
      {feedback.kind === "expression" && (
        <>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">识别文本</p>
            <p className="text-sm text-foreground leading-relaxed bg-secondary/50 rounded-2xl px-4 py-3">
              {feedback.transcript || "(未能识别到语音内容)"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">AI 深度分析</p>
            <ul className="space-y-3">
              {feedback.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4 mt-0.5 rounded-full bg-amber-100 text-amber-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-morandi-brown" />
              <p className="text-xs font-medium text-morandi-brown">AI 进阶版文案</p>
            </div>
            <p className="text-sm text-foreground leading-relaxed bg-morandi-beige/40 rounded-2xl px-4 py-3 border border-morandi-tan/20">
              {feedback.improved}
            </p>
          </div>
        </>
      )}

      {/* ── Reading feedback ────────────────────────────────────────────────── */}
      {feedback.kind === "reading" && (
        <>
          <div className="space-y-3">
            <ScoreBar label="发音清晰度" value={feedback.clarity} />
            <ScoreBar label="语速平稳度" value={feedback.pace} />
            <ScoreBar label="断句准确性" value={feedback.pause} />
          </div>
          {feedback.clarity === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5">
              <p className="text-xs text-amber-700">
                未检测到有效语音，建议检查麦克风权限并在安静环境下重试。
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">改进建议</p>
            <ul className="space-y-2">
              {feedback.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4 mt-0.5 rounded-full bg-morandi-beige flex-shrink-0 flex items-center justify-center text-[10px] font-semibold text-morandi-brown">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* ── Actions ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-1">
        {!saved && onSave && (
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-3 rounded-2xl bg-morandi-brown text-white text-sm font-medium hover:bg-morandi-brown/90 transition-colors"
          >
            保存记录
          </button>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 py-3 rounded-2xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          再练一次
        </button>
      </div>
    </motion.div>
  )
}
