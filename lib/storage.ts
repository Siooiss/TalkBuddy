// ─── Types ───────────────────────────────────────────────────────────────────

export type PracticeType = "expression" | "reading" | "logic"

export interface ExpressionAIFeedback {
  kind: "expression"
  transcript: string
  issues: string[]
  improved: string
}

export interface ReadingAIFeedback {
  kind: "reading"
  clarity: number   // 0–100
  pace: number      // 0–100
  pause: number     // 0–100
  suggestions: string[]
}

export interface LogicAIFeedback {
  kind: "logic"
  accuracy: number  // 0–100
  original: string
}

export type AIFeedback = ExpressionAIFeedback | ReadingAIFeedback | LogicAIFeedback

export interface PracticeRecord {
  id: string
  type: PracticeType
  title: string
  createdAt: string      // ISO-8601
  transcript: string     // user text / typed input
  feedback: AIFeedback
  isFavorited: boolean
}

// ─── Keys ────────────────────────────────────────────────────────────────────

const RECORDS_KEY = "tb_records"
const CHECKIN_KEY = "checkInDates"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10) // "2026-05-14"
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore quota / private-mode errors
  }
}

// ─── Records ─────────────────────────────────────────────────────────────────

export function saveRecord(
  record: Omit<PracticeRecord, "id" | "createdAt" | "isFavorited">,
): PracticeRecord {
  const full: PracticeRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    isFavorited: false,
  }
  const all = getRecords()
  all.unshift(full)
  safeSet(RECORDS_KEY, all)
  addCheckIn()
  return full
}

export function getRecords(): PracticeRecord[] {
  return safeGet<PracticeRecord[]>(RECORDS_KEY, [])
}

export function getRecentRecords(n = 3): PracticeRecord[] {
  return getRecords().slice(0, n)
}

export function toggleFavorite(id: string): void {
  const all = getRecords().map((r) =>
    r.id === id ? { ...r, isFavorited: !r.isFavorited } : r,
  )
  safeSet(RECORDS_KEY, all)
}

export function getFavorites(): PracticeRecord[] {
  return getRecords().filter((r) => r.isFavorited)
}

// ─── Check-in ────────────────────────────────────────────────────────────────

export function addCheckIn(d: Date = new Date()): void {
  const key = toDateKey(d)
  const dates = getCheckInDates()
  if (!dates.includes(key)) {
    safeSet(CHECKIN_KEY, [...dates, key])
  }
}

export function getCheckInDates(): string[] {
  return safeGet<string[]>(CHECKIN_KEY, [])
}

export function isCheckedIn(d: Date = new Date()): boolean {
  return getCheckInDates().includes(toDateKey(d))
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Set auth cookie so Next.js middleware can gate protected routes */
export function setAuthCookie(): void {
  document.cookie = "tb_auth=1; path=/; max-age=86400; SameSite=Lax"
}

export function clearAuthCookie(): void {
  document.cookie = "tb_auth=; path=/; max-age=0; SameSite=Lax"
}
