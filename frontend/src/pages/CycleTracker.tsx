
import { useEffect, useMemo, useState } from 'react'
import { createCycle, getCycles } from '../api'
import { ChevronLeft, ChevronRight, Sparkles, Droplet } from 'lucide-react'
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

export default function CycleTracker() {
  const [monthOffset, setMonthOffset] = useState(0)

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([])

  const [flow, setFlow] =
    useState<'None' | 'Light' | 'Medium' | 'Heavy'>('None')

  const [pain, setPain] = useState(2)

  const [saving, setSaving] = useState(false)

  const [cycles, setCycles] = useState<Cycle[]>([])

  const [loadingCycles, setLoadingCycles] =
    useState(true)

  // Fetch saved cycles when the page loads
  useEffect(() => {
    async function loadCycles() {
      try {
        const data = await getCycles()

        console.log('Saved cycles:', data)

        setCycles(data.cycles || [])
      } catch (error) {
        console.error('Error loading cycles:', error)
      } finally {
        setLoadingCycles(false)
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
    latestCycle?.cycleLength || DEFAULT_CYCLE_LENGTH

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

      // Immediately add the new cycle to the frontend state
      if (data.cycle) {
        setCycles((prev) => [
          data.cycle,
          ...prev,
        ])
      }

      alert('Cycle log saved successfully!')
    } catch (error) {
      console.error('Error saving cycle:', error)

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

    for (let d = 1; d <= daysInMonth; d++) {
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

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="font-display text-2xl">
          Cycle tracker
        </h2>

        <p className="text-sm text-muted-foreground">
          Log today and see your predicted phases.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardContent>

            <div className="flex items-center justify-between mb-5">

              <h3 className="font-display text-lg">
                {monthLabel}
              </h3>

              <div className="flex gap-1">

                <button
                  className="p-1.5 rounded-lg hover:bg-muted focus-ring"
                  onClick={() =>
                    setMonthOffset((m) => m - 1)
                  }
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  className="p-1.5 rounded-lg hover:bg-muted focus-ring"
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
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground mb-2">

              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
                (d, i) => (
                  <span key={i}>
                    {d}
                  </span>
                )
              )}

            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1.5">

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
                  new Date(
                    2026,
                    7,
                    7
                  ).toDateString()

                return (
                  <button
                    key={i}
                    className={`aspect-square rounded-xl text-sm flex items-center justify-center transition-colors focus-ring ${
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
            <div className="flex flex-wrap gap-4 mt-5 text-xs text-muted-foreground">

              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-bloom" />
                Period
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sun-soft" />
                Fertile window
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sun" />
                Ovulation
              </span>

            </div>

          </CardContent>
        </Card>

        {/* AI prediction card */}
        <Card className="bg-linear-to-br from-dusk to-bloom text-white">

          <CardContent>

            <div className="flex items-center gap-2 mb-3">

              <Sparkles size={16} />

              <span className="text-sm font-medium">
                AI prediction
              </span>

            </div>

            <p className="font-display text-2xl mb-1">
              Next period in 12 days
            </p>

            <p className="text-white/75 text-sm mb-5">
              Expected 19–21 August, based on your last 6 cycles
            </p>

            <div className="space-y-2.5 text-sm">

              <div className="flex justify-between border-t border-white/15 pt-2.5">

                <span className="text-white/70">
                  Cycle length
                </span>

                <span>
                  {cycleLength} days (avg)
                </span>

              </div>

              <div className="flex justify-between border-t border-white/15 pt-2.5">

                <span className="text-white/70">
                  Fertile window
                </span>

                <span>
                  Today – 3 days
                </span>

              </div>

              <div className="flex justify-between border-t border-white/15 pt-2.5">

                <span className="text-white/70">
                  Prediction confidence
                </span>

                <span>
                  High
                </span>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* Logging */}
      <Card>

        <CardContent>

          <h3 className="font-display text-lg mb-5">
            Log today
          </h3>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Flow */}
            <div>

              <p className="text-sm font-medium mb-3">
                Flow
              </p>

              <div className="flex flex-wrap gap-2">

                {FLOW_LEVELS.map((f) => (

                  <button
                    key={f}
                    onClick={() => setFlow(f)}
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

              <p className="text-sm font-medium mb-3">
                Symptoms
              </p>

              <div className="flex flex-wrap gap-2">

                {SYMPTOMS.map((s) => (

                  <button
                    key={s}
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

              <p className="text-sm font-medium mb-3">
                Pain level: {pain}/5
              </p>

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

              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>None</span>
                <span>Severe</span>
              </div>

            </div>

          </div>

          {/* Save button */}
          <Button
            className="mt-6"
            onClick={handleSaveLog}
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : "Save today's log"}
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}