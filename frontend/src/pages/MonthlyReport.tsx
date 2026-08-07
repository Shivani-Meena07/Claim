import ReactMarkdown from 'react-markdown'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { useEffect, useState } from 'react'
import { Download, Sparkles, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const CYCLE_LENGTHS = [
  { month: 'Mar', length: 29 },
  { month: 'Apr', length: 27 },
  { month: 'May', length: 28 },
  { month: 'Jun', length: 30 },
  { month: 'Jul', length: 26 },
  { month: 'Aug', length: 28 },
]

const SYMPTOM_FREQ = [
  { symptom: 'Cramps', count: 18 },
  { symptom: 'Fatigue', count: 14 },
  { symptom: 'Headache', count: 9 },
  { symptom: 'Bloating', count: 12 },
  { symptom: 'Acne', count: 6 },
]

const FLOW_SPLIT = [
  { name: 'Light', value: 2, color: 'var(--sun)' },
  { name: 'Medium', value: 3, color: 'var(--bloom)' },
  { name: 'Heavy', value: 1, color: 'var(--dusk)' },
]

const MOOD_TREND = [
  { week: 'W1', mood: 3.8 },
  { week: 'W2', mood: 4.2 },
  { week: 'W3', mood: 2.9 },
  { week: 'W4', mood: 3.6 },
]

const SLEEP_TREND = [
  { week: 'W1', hours: 7.2 },
  { week: 'W2', hours: 6.8 },
  { week: 'W3', hours: 6.1 },
  { week: 'W4', hours: 7.5 },
]

const chartTooltip = {
  background: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  fontSize: 13,
}

/* =========================================================
   AI SUMMARY FORMATTER
   ========================================================= */

function formatAISummary(text: string) {
  return (
    <div className="space-y-5 text-white">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-white mb-2 mt-4">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-white mb-2 mt-4">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="text-sm leading-7 text-white/90">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-2 text-sm leading-6 text-white/90">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-2 text-sm leading-6 text-white/90">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="text-white/90">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

/* =========================================================
   CLEAN AI TEXT
   ========================================================= */

function cleanSummaryText(text: string) {
  return text
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/^\s*[-*]\s*/gm, '')
    .replace(/^\s*\d+\.\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/* =========================================================
   BULLET EXTRACTION
   ========================================================= */

function extractBulletItems(text: string) {
  /*
   * Handles:
   *
   * - First suggestion
   * - Second suggestion
   *
   * * First suggestion
   * * Second suggestion
   *
   * 1. First suggestion
   * 2. Second suggestion
   */

  const items = text
    .split(/\n(?=\s*(?:[-*•]|\d+\.)\s+)/)
    .map((item) =>
      item
        .replace(/^\s*(?:[-*•]|\d+\.)\s*/, '')
        .trim()
    )
    .filter(Boolean)

  /*
   * If Gemini puts multiple "*" bullets on the same line.
   */
  if (items.length === 1 && /(?:^|\s)[-*•]\s+/.test(text)) {
    const inlineItems = text
      .split(/\s+(?=[-*•]\s+)/)
      .map((item) =>
        item
          .replace(/^\s*[-*•]\s*/, '')
          .trim()
      )
      .filter(Boolean)

    if (inlineItems.length > 1) {
      return inlineItems
    }
  }

  return items
}

function formatBulletItem(text: string) {
  const cleaned = cleanSummaryText(text)

  /*
   * Make "Cramp Relief:" or "Prioritize Rest:" bold.
   */
  const colonIndex = cleaned.indexOf(':')

  if (colonIndex > 0 && colonIndex < 60) {
    const title = cleaned.slice(0, colonIndex)
    const description = cleaned.slice(colonIndex + 1).trim()

    return (
      <>
        <span className="font-semibold text-white">
          {title}:
        </span>{' '}
        {description}
      </>
    )
  }

  return cleaned
}

/* =========================================================
   MONTHLY REPORT
   ========================================================= */

export default function MonthlyReport() {
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(true)
  const [aiError, setAiError] = useState('')

 useEffect(() => {
  const generateReport = async () => {
    try {
      setAiLoading(true)
      setAiError('')

      const token = localStorage.getItem('token')

      const response = await fetch('/api/reports/monthly-ai', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to generate AI report'
        )
      }

      setAiSummary(data.summary)
    } catch (error) {
      console.error('Monthly report AI error:', error)
      setAiError('Unable to generate AI summary.')
    } finally {
      setAiLoading(false)
    }
  }

  generateReport()
}, []) 

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">
            Monthly report
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            August 2026 summary
          </p>
        </div>

        <Button variant="outline">
          <Download size={16} />
          Download PDF
        </Button>
      </div>

      {/* =====================================================
          AI SUMMARY
          ===================================================== */}

      <Card className="overflow-hidden border-0 bg-gradient-to-r from-dusk to-bloom text-white">
        <CardContent className="p-6">

          {/* AI header */}
          <div className="flex items-center gap-3 mb-6">

            <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Sparkles size={17} />
            </div>

            <div>
              <p className="font-display text-lg font-semibold">
                Your monthly AI insights
              </p>

              <p className="text-xs text-white/70 mt-0.5">
                Based on your logged cycle and wellness data
              </p>
            </div>

          </div>

          {/* AI content */}
          {aiLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-3/4 rounded bg-white/15 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/15 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-white/15 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-white/15 animate-pulse" />
            </div>
          ) : aiError ? (
            <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3">
              <p className="text-sm text-white/90">
                {aiError}
              </p>
            </div>
          ) : (
            formatAISummary(aiSummary)
          )}

          {/* Disclaimer */}
          {!aiLoading && !aiError && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-[11px] leading-5 text-white/55">
                AI-generated wellness information based on your logged data.
                This is not medical advice.
              </p>
            </div>
          )}

        </CardContent>
      </Card>

      {/* =====================================================
          RED FLAG DETECTION
          ===================================================== */}

      <Card className="bg-sun-soft border-sun/20">
        <CardContent className="flex items-start gap-3">

          <AlertTriangle
            size={20}
            className="text-sun shrink-0 mt-0.5"
          />

          <div>
            <p className="font-medium text-sun">
              Worth a look: cycle length varied by 4 days this month
            </p>

            <p className="text-sm text-sun/80 mt-1">
              This is within normal variation for most people, but if it
              continues for 2+ more cycles, it may be worth mentioning to a
              doctor. Nothing urgent — just flagging it early.
            </p>
          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          CHARTS
          ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Cycle length */}
        <Card>
          <CardContent>
            <CardTitle className="mb-4">
              Cycle length (6 months)
            </CardTitle>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CYCLE_LENGTHS}
                  margin={{ left: -20, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[24, 32]}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip contentStyle={chartTooltip} />

                  <Line
                    type="monotone"
                    dataKey="length"
                    stroke="var(--bloom)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Symptom frequency */}
        <Card>
          <CardContent>
            <CardTitle className="mb-4">
              Symptom frequency
            </CardTitle>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SYMPTOM_FREQ}
                  margin={{ left: -20, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="symptom"
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip contentStyle={chartTooltip} />

                  <Bar
                    dataKey="count"
                    fill="var(--dusk)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Flow intensity */}
        <Card>
          <CardContent>
            <CardTitle className="mb-4">
              Flow intensity split
            </CardTitle>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FLOW_SPLIT}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {FLOW_SPLIT.map((f) => (
                      <Cell
                        key={f.name}
                        fill={f.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={chartTooltip} />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mood trend */}
        <Card>
          <CardContent>
            <CardTitle className="mb-4">
              Mood trend
            </CardTitle>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOOD_TREND}
                  margin={{ left: -20, right: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="reportMoodGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--sun)"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="var(--sun)"
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
                    dataKey="week"
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

                  <Tooltip contentStyle={chartTooltip} />

                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="var(--sun)"
                    strokeWidth={2.5}
                    fill="url(#reportMoodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card className="lg:col-span-2">
          <CardContent>
            <CardTitle className="mb-4">
              Sleep hours (weekly avg)
            </CardTitle>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={SLEEP_TREND}
                  margin={{ left: -20, right: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="week"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 9]}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip contentStyle={chartTooltip} />

                  <Bar
                    dataKey="hours"
                    fill="var(--sprout)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
