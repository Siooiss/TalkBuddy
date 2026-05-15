"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Star, RefreshCw, Loader2, MicOff } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RecordButton } from "@/components/practice/RecordButton"
import { WaveAnimation } from "@/components/practice/WaveAnimation"
import { AIFeedbackCard } from "@/components/practice/AIFeedbackCard"
import {
  getRandomTopic,
  getMockExpressionResult,
  inferPunctuation,
  type Topic,
} from "@/lib/data/topics"
import { saveRecord, toggleFavorite, type PracticeRecord } from "@/lib/storage"

type Stage = "idle" | "recording" | "processing" | "done"

// ─── Minimal SR typings (avoids dom-lib version issues) ───────────────────────
interface SRResult { readonly isFinal: boolean; 0: { transcript: string } }
interface SRResultList { readonly length: number; [index: number]: SRResult }
interface SREvent { readonly resultIndex: number; readonly results: SRResultList }
interface SRInstance {
  lang: string; continuous: boolean; interimResults: boolean
  start(): void; stop(): void; abort(): void
  onresult: ((e: SREvent) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

function getSR(): (new () => SRInstance) | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => SRInstance) | null
}

export default function ExpressionPracticePage() {
  const [topic, setTopic] = useState<Topic>(() => getRandomTopic())
  const [stage, setStage] = useState<Stage>("idle")
  const [countdown, setCountdown] = useState(60)
  const [feedback, setFeedback] = useState<ReturnType<typeof getMockExpressionResult> | null>(null)
  const [savedRecord, setSavedRecord] = useState<PracticeRecord | null>(null)
  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null)

  const recognitionRef = useRef<SRInstance | null>(null)
  const finalTextRef = useRef("")   // accumulates final SR results (hidden during recording)
  const stageRef = useRef<Stage>("idle")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setSpeechSupported(!!getSR()) }, [])
  useEffect(() => { stageRef.current = stage }, [stage])

  // Countdown
  useEffect(() => {
    if (stage !== "recording") return
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { stopRecording(); return 60 }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [stage]) // eslint-disable-line react-hooks/exhaustive-deps

  const buildRecognition = (): SRInstance | null => {
    const SR = getSR()
    if (!SR) return null
    const rec = new SR()
    rec.lang = "zh-CN"
    rec.continuous = true
    rec.interimResults = false   // collect only finals — no interim display

    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTextRef.current += e.results[i][0].transcript
        }
      }
    }

    rec.onerror = (e) => {
      if (e.error === "not-allowed") setSpeechSupported(false)
    }

    // Chrome auto-stops after silence — restart if still recording
    rec.onend = () => {
      if (stageRef.current === "recording") {
        try { rec.start() } catch { /* already started */ }
      }
    }

    return rec
  }

  const startRecording = () => {
    finalTextRef.current = ""
    setSavedRecord(null)
    setFeedback(null)

    const rec = buildRecognition()
    if (rec) { recognitionRef.current = rec; rec.start() }

    setCountdown(60)
    setStage("recording")
  }

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    recognitionRef.current?.stop()
    setStage("processing")

    // Give SR a moment to flush the last result, then analyse
    setTimeout(() => {
      const raw = finalTextRef.current.trim()
      const withPunct = raw ? inferPunctuation(raw) : ""
      const result = getMockExpressionResult(topic.text, withPunct || undefined)
      setFeedback(result)

      // ── Auto-save silently ──
      const rec = saveRecord({
        type: "expression",
        title: topic.text.slice(0, 24) + "…",
        transcript: result.transcript,
        feedback: {
          kind: "expression",
          transcript: result.transcript,
          issues: result.issues,
          improved: result.improved,
        },
      })
      setSavedRecord(rec)
      setStage("done")
    }, 1400)
  }

  const handleToggle = () => {
    if (stage === "recording") stopRecording()
    else if (stage === "idle" || stage === "done") startRecording()
  }

  const handleToggleFavorite = () => {
    if (!savedRecord) return
    toggleFavorite(savedRecord.id)
    setSavedRecord((r) => r ? { ...r, isFavorited: !r.isFavorited } : r)
  }

  const handleRefresh = () => {
    recognitionRef.current?.abort()
    if (timerRef.current) clearInterval(timerRef.current)
    setTopic(getRandomTopic(topic.id))
    setStage("idle")
    setFeedback(null)
    setSavedRecord(null)
    setCountdown(60)
    finalTextRef.current = ""
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <Link href="/home" className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">表达练习</h1>
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={!savedRecord}
          className="p-2 -mr-2 disabled:opacity-30"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              savedRecord?.isFavorited
                ? "fill-morandi-tan text-morandi-tan"
                : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Topic card */}
      <div className="px-4 mt-2">
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-5 shadow-sm border border-border"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="inline-block text-[11px] font-medium text-morandi-brown bg-morandi-beige/60 px-2 py-0.5 rounded-full mb-2">
                {topic.category}
              </span>
              <p className="text-base font-medium text-foreground leading-relaxed">
                {topic.text}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={stage === "recording"}
              className="p-2 rounded-full hover:bg-secondary transition-colors flex-shrink-0 disabled:opacity-40"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Centre zone */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4 min-h-[160px]">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-3 w-full max-w-sm"
            >
              {speechSupported === false && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5">
                  <MicOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    当前浏览器不支持语音识别，推荐使用 Chrome
                  </p>
                </div>
              )}
              <p className="text-muted-foreground text-sm">
                点击下方按钮开始录音，最多 60 秒
              </p>
            </motion.div>
          )}

          {stage === "recording" && (
            <motion.div
              key="rec"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-4"
            >
              <span className="text-4xl font-bold text-morandi-brown tabular-nums">
                {`${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")}`}
              </span>
              <WaveAnimation isActive bars={14} />
              <p className="text-sm text-muted-foreground">录音中，请自然表达…</p>
            </motion.div>
          )}

          {stage === "processing" && (
            <motion.div
              key="proc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="w-8 h-8 text-morandi-tan animate-spin" />
              <p className="text-sm text-muted-foreground">识别与分析中，请稍候…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Feedback card (auto-saved, saved=true immediately) */}
      <AnimatePresence>
        {stage === "done" && feedback && (
          <div className="px-4 mb-4">
            <AIFeedbackCard
              feedback={{
                kind: "expression",
                transcript: feedback.transcript,
                issues: feedback.issues,
                improved: feedback.improved,
              }}
              onRetry={handleRefresh}
              saved
            />
          </div>
        )}
      </AnimatePresence>

      {/* Record button */}
      {stage !== "done" && (
        <div className="px-4 pb-12 pt-2 flex flex-col items-center gap-3">
          <RecordButton
            isRecording={stage === "recording"}
            onToggle={handleToggle}
            disabled={stage === "processing"}
          />
          <p className="text-sm text-muted-foreground">
            {stage === "recording"
              ? "点击停止录音"
              : stage === "processing"
                ? "处理中…"
                : "点击开始录音"}
          </p>
        </div>
      )}
    </div>
  )
}
