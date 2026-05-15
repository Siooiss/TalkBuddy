"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Star, RefreshCw, Loader2, MicOff } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { RecordButton } from "@/components/practice/RecordButton"
import { WaveAnimation } from "@/components/practice/WaveAnimation"
import { AIFeedbackCard } from "@/components/practice/AIFeedbackCard"
import {
  getRandomReading,
  calcClarity,
  calcPace,
  calcPause,
  generateReadingSuggestions,
  type ReadingText,
} from "@/lib/data/readings"
import { saveRecord, toggleFavorite, type PracticeRecord } from "@/lib/storage"

type Stage = "idle" | "recording" | "processing" | "done"

// ─── Minimal SR typings ───────────────────────────────────────────────────────
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

export default function ReadingPracticePage() {
  const [text, setText] = useState<ReadingText>(() => getRandomReading())
  const [stage, setStage] = useState<Stage>("idle")
  const [savedRecord, setSavedRecord] = useState<PracticeRecord | null>(null)
  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null)
  const [readingScores, setReadingScores] = useState<{
    clarity: number; pace: number; pause: number; suggestions: string[]
  } | null>(null)

  const recognitionRef = useRef<SRInstance | null>(null)
  const finalTextRef = useRef("")
  const stageRef = useRef<Stage>("idle")
  const recordStartRef = useRef(0)

  useEffect(() => { setSpeechSupported(!!getSR()) }, [])
  useEffect(() => { stageRef.current = stage }, [stage])

  const buildRecognition = (): SRInstance | null => {
    const SR = getSR()
    if (!SR) return null
    const rec = new SR()
    rec.lang = "zh-CN"
    rec.continuous = true
    rec.interimResults = false   // collect finals only — no display during reading

    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalTextRef.current += e.results[i][0].transcript
      }
    }

    rec.onerror = (e) => {
      if (e.error === "not-allowed") setSpeechSupported(false)
    }

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
    setReadingScores(null)
    recordStartRef.current = Date.now()

    const rec = buildRecognition()
    if (rec) { recognitionRef.current = rec; rec.start() }
    setStage("recording")
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setStage("processing")

    setTimeout(() => {
      const recognized = finalTextRef.current.trim()
      const durationSec = (Date.now() - recordStartRef.current) / 1000

      // ── Levenshtein-based scores ──
      const clarity = calcClarity(recognized, text.content)
      const pace = calcPace(
        recognized.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").length,
        durationSec,
      )
      const pause = calcPause(recognized, text.content, clarity)
      const suggestions = generateReadingSuggestions(clarity, pace, pause)

      setReadingScores({ clarity, pace, pause, suggestions })

      // ── Auto-save silently ──
      const rec = saveRecord({
        type: "reading",
        title: text.title,
        transcript: recognized || "(未能识别语音)",
        feedback: { kind: "reading", clarity, pace, pause, suggestions },
      })
      setSavedRecord(rec)
      setStage("done")
    }, 1600)
  }

  const handleToggleRecording = () => {
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
    setText(getRandomReading(text.id))
    setStage("idle")
    setSavedRecord(null)
    setReadingScores(null)
    finalTextRef.current = ""
  }

  const handleRetry = () => {
    recognitionRef.current?.abort()
    setStage("idle")
    setSavedRecord(null)
    setReadingScores(null)
    finalTextRef.current = ""
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <Link href="/home" className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">朗读练习</h1>
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

      {/* Text area */}
      <div className="flex-1 px-4 pb-3 overflow-auto" style={{ maxHeight: "52vh" }}>
        <motion.div
          key={text.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-3xl p-5 shadow-sm border border-border h-full"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-medium text-morandi-brown bg-morandi-beige/60 px-2 py-0.5 rounded-full">
                {text.category}
              </span>
              <h2 className="text-base font-semibold text-foreground mt-1.5">{text.title}</h2>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={stage === "recording"}
              className="p-2 rounded-full hover:bg-secondary transition-colors disabled:opacity-40 ml-2"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-[15px] text-foreground leading-relaxed">{text.content}</p>
        </motion.div>
      </div>

      {/* AI Feedback */}
      <AnimatePresence>
        {stage === "done" && readingScores && (
          <div className="px-4 pb-3">
            <AIFeedbackCard
              feedback={{
                kind: "reading",
                clarity: readingScores.clarity,
                pace: readingScores.pace,
                pause: readingScores.pause,
                suggestions: readingScores.suggestions,
              }}
              onRetry={handleRetry}
              saved
            />
          </div>
        )}
      </AnimatePresence>

      {/* Recording panel */}
      {stage !== "done" && (
        <div className="bg-secondary/40 rounded-t-[2rem] px-4 pt-5 pb-12">
          {speechSupported === false && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 mb-4">
              <MicOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">推荐使用 Chrome 以获得最佳语音识别效果</p>
            </div>
          )}

          <div className="flex items-center justify-center h-14 mb-5">
            <AnimatePresence mode="wait">
              {stage === "recording" && (
                <motion.div
                  key="wave"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <WaveAnimation isActive bars={15} />
                </motion.div>
              )}
              {stage === "processing" && (
                <motion.div
                  key="proc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 text-morandi-tan animate-spin" />
                  <span className="text-sm text-muted-foreground">AI 评分中…</span>
                </motion.div>
              )}
              {stage === "idle" && (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground text-sm"
                >
                  按照上方文本朗读，点击开始录音
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-3">
            <RecordButton
              isRecording={stage === "recording"}
              onToggle={handleToggleRecording}
              disabled={stage === "processing"}
            />
            <p className="text-sm text-muted-foreground">
              {stage === "recording" ? "点击停止，AI 将评估朗读质量" : "点击开始录音"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
