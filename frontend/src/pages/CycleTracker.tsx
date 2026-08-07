
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  createCycle,
  getCycles,
  getPrediction,
  getCycleAIInsight,
} from '../api'
import {
  ChevronLeft,
  ChevronRight,
  Droplet,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

// Fallback values used only when no cycle has been saved yet
const DEFAULT_CYCLE_START = new Date(2026, 7, 3)
const DEFAULT_CYCLE_LENGTH = 28

function dayType(
  date: Date,
  cycleStart: Date,
  cycleLength: number
) {
  const diffDays = Math.floor(
    (date.getTime() - cycleStart.getTime()) / 86400000
  )

  const cycleDay =
    ((diffDays % cycleLength) + cycleLength) % cycleLength

  // First 5 days = period
  if (cycleDay < 5) {
    return 'period'
  }

  // Approximate ovulation
  const ovulationDay = Math.floor(cycleLength / 2) - 1

  if (cycleDay === ovulationDay) {
    return 'ovulation'
  }

  // Approximate fertile window
  if (
    cycleDay >= ovulationDay - 2 &&
    cycleDay <= ovulationDay + 1
  ) {
    return 'fertile'
  }

  return 'none'
}

const DAY_STYLES: Record<string, string> = {
  period: 'bg-bloom text-white',
  fertile: 'bg-sun-soft text-sun',
  ovulation: 'bg-sun text-white',
  none: '',
}

const SYMPTOMS = [
  'Cramps',
  'Headache',
  'Bloating',
  'Fatigue',
  'Acne',
  'Backache',
  'Nausea',
  'Tender breasts',
]

const FLOW_LEVELS: Array<
  'None' | 'Light' | 'Medium' | 'Heavy'
> = [
  'None',
  'Light',
  'Medium',
  'Heavy',
]

interface Cycle {
  _id: string
  startDate: string
  endDate?: string
  cycleLength: number
  flow: 'None' | 'Light' | 'Medium' | 'Heavy'
  symptoms: string[]
  pain: number
}

interface Prediction {
  averageCycleLength: number
  nextPeriod: string
  ovulationDate: string
  fertileWindow: {
    start: string
    end: string
  }
}

export default function CycleTracker() {
  const [monthOffset, setMonthOffset] = useState(0)

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([])

  const [flow, setFlow] =
    useState<'None' | 'Light' | 'Medium' | 'Heavy'>('None')

  const [pain, setPain] = useState(0)

  const [saving, setSaving] = useState(false)

  const [cycles, setCycles] = useState<Cycle[]>([])

  const [prediction, setPrediction] =
    useState<Prediction | null>(null)

  const [aiInsight, setAiInsight] = useState('')

  const [loadingAI, setLoadingAI] = useState(false)

  // Load prediction
  async function loadPrediction() {
    try {
      const data = await getPrediction()

      console.log('Prediction:', data)

      if (data.prediction) {
        setPrediction(data.prediction)
      }
    } catch (error) {
      console.error(
        'Error loading prediction:',
        error
      )
    }
  }

  // Load AI insight
  async function loadAIInsight() {
    try {
      setLoadingAI(true)

      const data = await getCycleAIInsight()

      console.log('AI insight:', data)

      setAiInsight(data.insight || '')
    } catch (error) {
      console.error(
        'Error loading AI insight:',
        error
      )

      setAiInsight('')
    } finally {
      setLoadingAI(false)
    }
  }

  // Fetch saved cycles when page loads
  useEffect(() => {
    async function loadCycles() {
      try {
        const data = await getCycles()

        console.log('Saved cycles:', data)

        const savedCycles = data.cycles || []

        setCycles(savedCycles)

        if (savedCycles.length > 0) {
          await loadPrediction()
          await loadAIInsight()
        }
      } catch (error) {
        console.error(
          'Error loading cycles:',
          error
        )
      }
    }

    loadCycles()
  }, [])

  // Latest saved cycle
  const latestCycle =
    cycles.length > 0 ? cycles[0] : null

  // Use saved cycle values if available
  const cycleStart = latestCycle
    ? new Date(latestCycle.startDate)
    : DEFAULT_CYCLE_START

  const cycleLength =
    prediction?.averageCycleLength ||
    latestCycle?.cycleLength ||
    DEFAULT_CYCLE_LENGTH

  // Save today's cycle log
  async function handleSaveLog() {
    try {
      setSaving(true)

      const cycleData = {
        startDate: new Date().toISOString(),
        cycleLength: 28,
        flow,
        symptoms: selectedSymptoms,
        pain,
      }

      const data = await createCycle(cycleData)

      console.log('Cycle saved:', data)

      if (data.cycle) {
        setCycles((prev) => [
          data.cycle,
          ...prev,
        ])

        // Reset form
        setSelectedSymptoms([])
        setFlow('None')
        setPain(0)

        // Refresh prediction and AI insight
        await loadPrediction()
        await loadAIInsight()
      }

      alert('Cycle log saved successfully!')
    } catch (error) {
      console.error(
        'Error saving cycle:',
        error
      )

      alert('Failed to save cycle log.')
    } finally {
      setSaving(false)
    }
  }

  const viewMonth = new Date(
    2026,
    7 + monthOffset,
    1
  )

  const monthLabel =
    viewMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

  const days = useMemo(() => {
    const start = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      1
    )

    const startWeekday = start.getDay()

    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0
    ).getDate()

    const cells: (Date | null)[] =
      Array(startWeekday).fill(null)

    for (
      let d = 1;
      d <= daysInMonth;
      d++
    ) {
      cells.push(
        new Date(
          viewMonth.getFullYear(),
          viewMonth.getMonth(),
          d
        )
      )
    }

    return cells
  }, [viewMonth])

  function toggleSymptom(s: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(s)
        ? prev.filter((x) => x !== s)
        : [...prev, s]
    )
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(
      'en-US',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Cycle tracker
        </h2>

        <p className="text-sm text-muted-foreground">
          Track your cycle, symptoms, and daily wellness patterns.
        </p>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-5 md:p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="font-display text-lg font-semibold">
                {monthLabel}
              </h3>

              <p className="text-xs text-muted-foreground mt-0.5">
                Your estimated cycle phases
              </p>
            </div>

            <div className="flex items-center gap-1">

              <button
                type="button"
                className="p-2 rounded-lg hover:bg-muted transition-colors focus-ring"
                onClick={() =>
                  setMonthOffset((m) => m - 1)
                }
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                className="p-2 rounded-lg hover:bg-muted transition-colors focus-ring"
                onClick={() =>
                  setMonthOffset((m) => m + 1)
                }
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>

            </div>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">

            {[
              'S',
              'M',
              'T',
              'W',
              'T',
              'F',
              'S',
            ].map((d, i) => (
              <span key={i}>
                {d}
              </span>
            ))}

          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">

            {days.map((date, i) => {

              if (!date) {
                return <div key={i} />
              }

              const type = dayType(
                date,
                cycleStart,
                cycleLength
              )

              const isToday =
                date.toDateString() ===
                new Date().toDateString()

              return (
                <button
                  key={i}
                  type="button"
                  className={`aspect-square rounded-xl text-sm font-medium flex items-center justify-center transition-all focus-ring ${
                    DAY_STYLES[type] ||
                    'hover:bg-muted'
                  } ${
                    isToday
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                      : ''
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}

          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 pt-5 border-t border-border text-xs text-muted-foreground">

            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-bloom" />
              Period
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sun-soft" />
              Fertile window
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sun" />
              Ovulation
            </span>

          </div>

        </CardContent>
      </Card>

      {/* Cycle Overview */}
      <Card>
        <CardContent className="p-5 md:p-6">

          <div className="flex items-center gap-2 mb-6">

            <div className="h-8 w-8 rounded-lg bg-bloom/10 flex items-center justify-center">
              <Sparkles
                size={16}
                className="text-bloom"
              />
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                Cycle overview
              </h3>

              <p className="text-xs text-muted-foreground">
                Your current cycle estimates
              </p>
            </div>

          </div>

          {prediction ? (

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">

              {/* Next period */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Estimated next period
                </p>

                <p className="text-sm font-semibold">
                  {formatDate(
                    prediction.nextPeriod
                  )}
                </p>

              </div>

              {/* Cycle length */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Cycle length
                </p>

                <p className="text-sm font-semibold">
                  {prediction.averageCycleLength} days
                </p>

              </div>

              {/* Ovulation */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Estimated ovulation
                </p>

                <p className="text-sm font-semibold">
                  {formatDate(
                    prediction.ovulationDate
                  )}
                </p>

              </div>

              {/* Fertile window */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Estimated fertile window
                </p>

                <p className="text-sm font-semibold">
                  {formatDate(
                    prediction.fertileWindow.start
                  )}
                  {' – '}
                  {formatDate(
                    prediction.fertileWindow.end
                  )}
                </p>

              </div>

            </div>

          ) : (

            <div className="rounded-xl bg-muted/40 p-4">

              <p className="text-sm text-muted-foreground">
                Save a cycle to see your cycle estimates.
              </p>

            </div>

          )}

          <p className="text-xs leading-relaxed text-muted-foreground mt-5">
            These are calendar estimates based on your saved cycle length.
            They are not AI predictions.
          </p>

          {/* AI Insight */}
          <div className="mt-6 pt-6 border-t border-border">

            <div className="flex items-center gap-2 mb-3">

              <div className="h-7 w-7 rounded-lg bg-bloom/10 flex items-center justify-center">
                <Sparkles
                  size={14}
                  className="text-bloom"
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  AI insight
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Based on your recent cycle data
                </p>
              </div>

            </div>

            <div className="rounded-xl bg-bloom/5 border border-bloom/10 p-4 md:p-5">

              {loadingAI ? (

                <div className="flex items-center gap-2 text-sm text-muted-foreground">

                  <Sparkles
                    size={15}
                    className="text-bloom animate-pulse"
                  />

                  <span>
                    Generating your personalized insight...
                  </span>

                </div>

              ) : aiInsight ? (

                <div className="text-sm leading-6 text-foreground/80">

                  <ReactMarkdown
                    components={{

                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0">
                          {children}
                        </p>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      ),

                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 mb-3 space-y-1.5">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 mb-3 space-y-1.5">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => (
                        <li className="pl-1">
                          {children}
                        </li>
                      ),

                      h1: ({ children }) => (
                        <h1 className="text-base font-semibold text-foreground mb-2">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="text-base font-semibold text-foreground mb-2">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold text-foreground mb-2">
                          {children}
                        </h3>
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-bloom/40 pl-3 my-3 italic text-muted-foreground">
                          {children}
                        </blockquote>
                      ),

                    }}
                  >
                    {aiInsight}
                  </ReactMarkdown>

                </div>

              ) : (

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Save a cycle to receive a personalized AI insight.
                </p>

              )}

            </div>

          </div>

        </CardContent>
      </Card>

      {/* Log Today */}
      <Card>
        <CardContent className="p-5 md:p-6">

          <div className="mb-6">

            <h3 className="font-display text-lg font-semibold">
              Log today
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Record how you're feeling today.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Flow */}
            <div>

              <p className="text-sm font-semibold mb-3">
                Flow
              </p>

              <div className="flex flex-wrap gap-2">

                {FLOW_LEVELS.map((f) => (

                  <button
                    key={f}
                    type="button"
                    onClick={() =>
                      setFlow(f)
                    }
                    className={`px-3.5 py-2 rounded-xl text-sm border transition-colors focus-ring ${
                      flow === f
                        ? 'bg-bloom text-white border-bloom'
                        : 'border-border hover:bg-muted'
                    }`}
                  >

                    <Droplet
                      size={13}
                      className="inline mr-1.5 -mt-0.5"
                    />

                    {f}

                  </button>

                ))}

              </div>

            </div>

            {/* Symptoms */}
            <div>

              <p className="text-sm font-semibold mb-3">
                Symptoms
              </p>

              <div className="flex flex-wrap gap-2">

                {SYMPTOMS.map((s) => (

                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      toggleSymptom(s)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors focus-ring ${
                      selectedSymptoms.includes(s)
                        ? 'bg-dusk-soft text-dusk border-dusk/30'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {s}
                  </button>

                ))}

              </div>

            </div>

            {/* Pain */}
            <div>

              <p className="text-sm font-semibold mb-3">
                Pain level
              </p>

              <div className="flex items-center justify-between mb-3">

                <span className="text-xs text-muted-foreground">
                  None
                </span>

                <span className="text-sm font-semibold">
                  {pain}/5
                </span>

                <span className="text-xs text-muted-foreground">
                  Severe
                </span>

              </div>

              <input
                type="range"
                min={0}
                max={5}
                value={pain}
                onChange={(e) =>
                  setPain(
                    Number(e.target.value)
                  )
                }
                className="w-full accent-bloom"
              />

            </div>

          </div>

          {/* Save button */}
          <div className="mt-7 pt-5 border-t border-border">

            <Button
              onClick={handleSaveLog}
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : "Save today's log"}
            </Button>

          </div>

        </CardContent>
      </Card>

      {/* Last Saved Log */}
      {latestCycle && (

        <Card>
          <CardContent className="p-5 md:p-6">

            <div className="mb-6">

              <h3 className="font-display text-lg font-semibold">
                Last saved log
              </h3>

              <p className="text-xs text-muted-foreground mt-1">
                Your most recently recorded cycle information.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">

              {/* Date */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Date
                </p>

                <p className="text-sm font-semibold">
                  {formatDate(
                    latestCycle.startDate
                  )}
                </p>

              </div>

              {/* Flow */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Flow
                </p>

                <p className="text-sm font-semibold">
                  {latestCycle.flow}
                </p>

              </div>

              {/* Symptoms */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Symptoms
                </p>

                {latestCycle.symptoms &&
                latestCycle.symptoms.length > 0 ? (

                  <div className="flex flex-wrap gap-1.5">

                    {latestCycle.symptoms.map(
                      (symptom) => (
                        <span
                          key={symptom}
                          className="px-2.5 py-1 rounded-full bg-dusk-soft text-dusk text-xs"
                        >
                          {symptom}
                        </span>
                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm font-semibold">
                    None
                  </p>

                )}

              </div>

              {/* Pain */}
              <div className="rounded-xl bg-muted/40 p-4">

                <p className="text-xs text-muted-foreground mb-2">
                  Pain level
                </p>

                <p className="text-sm font-semibold">
                  {latestCycle.pain}/5
                </p>

              </div>

            </div>

          </CardContent>
        </Card>

      )}

    </div>
  )
}