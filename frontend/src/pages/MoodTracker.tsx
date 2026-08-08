import { useEffect, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const API_URL = import.meta.env.VITE_API_URL

const MOODS = [
  { emoji: '😢', label: 'Low', value: 1 },
  { emoji: '😕', label: 'Down', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😄', label: 'Great', value: 5 },
]

const SLEEP_QUALITY = [
  { emoji: '😫', label: 'Poor', value: 1 },
  { emoji: '😕', label: 'Below average', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😴', label: 'Excellent', value: 5 },
]

type MoodEntry = {
  _id: string
  mood: number
  note: string
  date: string
}

type SleepEntry = {
  _id: string
  hours: number
  quality: number
  date: string
}

export default function MoodTracker() {
  // ===============================
  // MOOD STATE
  // ===============================

  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [moodLoading, setMoodLoading] = useState(true)
  const [moodSaving, setMoodSaving] = useState(false)

  // ===============================
  // SLEEP STATE
  // ===============================

  const [sleepHours, setSleepHours] = useState('')
  const [selectedSleepQuality, setSelectedSleepQuality] =
    useState<number | null>(null)
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([])
  const [sleepLoading, setSleepLoading] = useState(true)
  const [sleepSaving, setSleepSaving] = useState(false)

  const [error, setError] = useState('')

  // ===============================
  // FETCH MOODS
  // ===============================

  const fetchMoods = async () => {
    try {
      setMoodLoading(true)

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_URL}/api/mood`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch moods')
      }

      setMoodHistory(data.moods || [])
    } catch (err) {
      console.error('Fetch moods error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load mood history'
      )
    } finally {
      setMoodLoading(false)
    }
  }

  // ===============================
  // FETCH SLEEP
  // ===============================

  const fetchSleep = async () => {
    try {
      setSleepLoading(true)

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_URL}/api/sleep`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch sleep data'
        )
      }

      setSleepHistory(data.sleep || [])
    } catch (err) {
      console.error('Fetch sleep error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load sleep history'
      )
    } finally {
      setSleepLoading(false)
    }
  }

  useEffect(() => {
    fetchMoods()
    fetchSleep()
  }, [])

  // ===============================
  // SAVE MOOD
  // ===============================

  const saveMood = async () => {
    if (selectedMood === null) return

    try {
      setMoodSaving(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_URL}/api/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood: selectedMood,
          note: note.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save mood'
        )
      }

      setMoodHistory((current) => [
        data.mood,
        ...current,
      ])

      setSelectedMood(null)
      setNote('')
    } catch (err) {
      console.error('Save mood error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save mood'
      )
    } finally {
      setMoodSaving(false)
    }
  }

  // ===============================
  // SAVE SLEEP
  // ===============================

  const saveSleep = async () => {
    if (!sleepHours || selectedSleepQuality === null) return

    const hours = Number(sleepHours)

    if (hours < 0 || hours > 24) {
      setError('Sleep hours must be between 0 and 24')
      return
    }

    try {
      setSleepSaving(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_URL}/api/sleep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hours,
          quality: selectedSleepQuality,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save sleep data'
        )
      }

      setSleepHistory((current) => [
        data.sleep,
        ...current,
      ])

      setSleepHours('')
      setSelectedSleepQuality(null)
    } catch (err) {
      console.error('Save sleep error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save sleep data'
      )
    } finally {
      setSleepSaving(false)
    }
  }

  // ===============================
  // MOOD CHART
  // ===============================

  const moodChartData = useMemo(() => {
    return [...moodHistory]
      .slice(0, 7)
      .reverse()
      .map((entry) => ({
        day: new Date(entry.date).toLocaleDateString(
          'en-US',
          { weekday: 'short' }
        ),
        mood: entry.mood,
      }))
  }, [moodHistory])

  // ===============================
  // SLEEP CHART
  // ===============================

  const sleepChartData = useMemo(() => {
    return [...sleepHistory]
      .slice(0, 7)
      .reverse()
      .map((entry) => ({
        day: new Date(entry.date).toLocaleDateString(
          'en-US',
          { weekday: 'short' }
        ),
        hours: entry.hours,
      }))
  }, [sleepHistory])

  return (
    <div className="space-y-6">
      {/* ===============================
          HEADER
      =============================== */}

      <div>
        <h1 className="font-display text-2xl">
          Mood & Wellness Tracker
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Track how you're feeling and how well you're sleeping.
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* ===============================
          MOOD ENTRY
      =============================== */}

      <Card>
        <CardContent>
          <h3 className="font-display text-lg mb-4">
            How are you feeling right now?
          </h3>

          <div className="flex flex-wrap justify-between gap-4">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex-1 min-w-[90px] flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all focus-ring ${
                  selectedMood === m.value
                    ? 'border-bloom bg-bloom-soft scale-105'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <span className="text-3xl">
                  {m.emoji}
                </span>

                <span className="text-sm font-medium">
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about today (optional)"
            rows={2}
            className="w-full mt-5 p-3.5 rounded-xl bg-input-background border border-border text-sm placeholder:text-muted-foreground focus-ring focus-visible:border-bloom resize-none"
          />

          <Button
            className="mt-4"
            disabled={selectedMood === null || moodSaving}
            onClick={saveMood}
          >
            {moodSaving ? 'Saving...' : 'Save mood'}
          </Button>
        </CardContent>
      </Card>

      {/* ===============================
          MOOD TREND
      =============================== */}

      <Card>
        <CardContent>
          <h3 className="font-display text-lg mb-1">
            Mood trend
          </h3>

          <p className="text-sm text-muted-foreground mb-5">
            Your mood entries from the last 7 logged days.
          </p>

          {moodLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading mood history...
            </p>
          ) : moodChartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No mood entries yet.
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={moodChartData}
                  margin={{ left: -20, right: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="moodGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--bloom)"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="var(--bloom)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 5]}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="var(--bloom)"
                    strokeWidth={2.5}
                    fill="url(#moodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===============================
          SLEEP TRACKER
      =============================== */}

      <Card>
        <CardContent>
          <h3 className="font-display text-lg mb-1">
            Sleep tracker
          </h3>

          <p className="text-sm text-muted-foreground mb-5">
            How did you sleep last night?
          </p>

          <label className="text-sm font-medium">
            Hours slept
          </label>

          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            placeholder="e.g. 7.5"
            className="w-full mt-2 h-11 px-4 rounded-xl bg-input-background border border-border text-sm focus-ring focus-visible:border-bloom"
          />

          <p className="text-sm font-medium mt-5 mb-3">
            Sleep quality
          </p>

          <div className="flex flex-wrap gap-2">
            {SLEEP_QUALITY.map((quality) => (
              <button
                key={quality.value}
                onClick={() =>
                  setSelectedSleepQuality(quality.value)
                }
                className={`flex-1 min-w-[100px] flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${
                  selectedSleepQuality === quality.value
                    ? 'border-bloom bg-bloom-soft'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <span className="text-xl">
                  {quality.emoji}
                </span>

                <span className="text-xs">
                  {quality.label}
                </span>
              </button>
            ))}
          </div>

          <Button
            className="mt-4"
            disabled={
              !sleepHours ||
              selectedSleepQuality === null ||
              sleepSaving
            }
            onClick={saveSleep}
          >
            {sleepSaving ? 'Saving...' : 'Save sleep'}
          </Button>
        </CardContent>
      </Card>

      {/* ===============================
          SLEEP TREND
      =============================== */}

      <Card>
        <CardContent>
          <h3 className="font-display text-lg mb-1">
            Sleep trend
          </h3>

          <p className="text-sm text-muted-foreground mb-5">
            Your sleep duration from the last 7 logged days.
          </p>

          {sleepLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading sleep history...
            </p>
          ) : sleepChartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sleep entries yet.
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={sleepChartData}
                  margin={{ left: -20, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 12]}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--bloom)"
                    strokeWidth={2.5}
                    fill="var(--bloom-soft)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===============================
          MOOD TIMELINE
      =============================== */}

      <Card>
        <CardContent>
          <h3 className="font-display text-lg mb-4">
            Mood timeline
          </h3>

          {moodLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading...
            </p>
          ) : moodHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No mood entries yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {moodHistory.map((entry) => {
                const mood = MOODS.find(
                  (m) => m.value === entry.mood
                )

                return (
                  <li
                    key={entry._id}
                    className="flex items-center gap-4"
                  >
                    <span className="text-2xl w-8">
                      {mood?.emoji}
                    </span>

                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {new Date(
                          entry.date
                        ).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {entry.note || mood?.label}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}