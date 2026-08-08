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

type CycleLength = {
  month: string
  length: number
}

type SymptomFrequency = {
  symptom: string
  count: number
}

type FlowSplit = {
  name: string
  value: number
}

type MoodTrend = {
  date: string
  mood: number
  note?: string
}

type SleepTrend = {
  date: string
  hours: number
  quality?: number
}

type ReportData = {
  cycleLengths: CycleLength[]
  symptomFrequency: SymptomFrequency[]
  flowSplit: FlowSplit[]
  moodTrend: MoodTrend[]
  sleepTrend: SleepTrend[]
}

const FLOW_COLORS = [
  'var(--sun)',
  'var(--bloom)',
  'var(--dusk)',
  'var(--sprout)',
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
   MONTHLY REPORT
   ========================================================= */

export default function MonthlyReport() {
  const [aiSummary, setAiSummary] = useState('')
  const [reportData, setReportData] = useState<ReportData>({
    cycleLengths: [],
    symptomFrequency: [],
    flowSplit: [],
    moodTrend: [],
    sleepTrend: [],
  })

  const [aiLoading, setAiLoading] = useState(true)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    const generateReport = async () => {
      try {
        setAiLoading(true)
        setAiError('')

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error('Authentication required')
        }

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

        setAiSummary(data.summary || '')

        setReportData({
          cycleLengths: data.reportData?.cycleLengths || [],
          symptomFrequency:
            data.reportData?.symptomFrequency || [],
          flowSplit: data.reportData?.flowSplit || [],
          moodTrend: data.reportData?.moodTrend || [],
          sleepTrend: data.reportData?.sleepTrend || [],
        })
      } catch (error) {
        console.error('Monthly report AI error:', error)
        setAiError('Unable to generate AI summary.')
      } finally {
        setAiLoading(false)
      }
    }

    generateReport()
  }, [])

  const {
    cycleLengths,
    symptomFrequency,
    flowSplit,
    moodTrend,
    sleepTrend,
  } = reportData

  /* =========================================================
     DYNAMIC MONTH
     ========================================================= */

  const latestMonth =
    cycleLengths.length > 0
      ? cycleLengths[cycleLengths.length - 1].month
      : 'Current'

  const currentYear = new Date().getFullYear()

  /* =========================================================
     MOOD DATA FOR CHART
     ========================================================= */

  const formattedMoodTrend = moodTrend.map((entry) => ({
    ...entry,
    label: new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  /* =========================================================
     SLEEP DATA FOR CHART
     ========================================================= */

  const formattedSleepTrend = sleepTrend.map((entry) => ({
    ...entry,
    label: new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  /* =========================================================
     FLOW DATA WITH COLORS
     ========================================================= */

  const formattedFlowSplit = flowSplit.map((entry, index) => ({
    ...entry,
    color: FLOW_COLORS[index % FLOW_COLORS.length],
  }))

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">
            Monthly report
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {latestMonth} {currentYear} summary
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

      {!aiLoading && cycleLengths.length > 1 && (
        <Card className="bg-sun-soft border-sun/20">
          <CardContent className="flex items-start gap-3">

            <AlertTriangle
              size={20}
              className="text-sun shrink-0 mt-0.5"
            />

            <div>
              <p className="font-medium text-sun">
                Cycle length tracking
              </p>

              <p className="text-sm text-sun/80 mt-1">
                Your report is based on the cycle data you have logged.
                Continue tracking your cycles to identify meaningful
                patterns over time.
              </p>
            </div>

          </CardContent>
        </Card>
      )}

      {/* =====================================================
          CHARTS
          ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* ===================================================
            CYCLE LENGTH
            =================================================== */}

        <Card>
          <CardContent>

            <CardTitle className="mb-4">
              Cycle length ({cycleLengths.length} logged)
            </CardTitle>

            {cycleLengths.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No cycle length data available yet.
              </p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cycleLengths}
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
                      domain={['auto', 'auto']}
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
            )}

          </CardContent>
        </Card>

        {/* ===================================================
            SYMPTOM FREQUENCY
            =================================================== */}

        <Card>
          <CardContent>

            <CardTitle className="mb-4">
              Symptom frequency
            </CardTitle>

            {symptomFrequency.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No symptom data logged yet.
              </p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={symptomFrequency}
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
            )}

          </CardContent>
        </Card>

        {/* ===================================================
            FLOW INTENSITY
            =================================================== */}

        <Card>
          <CardContent>

            <CardTitle className="mb-4">
              Flow intensity split
            </CardTitle>

            {formattedFlowSplit.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No flow data logged yet.
              </p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                    <Pie
                      data={formattedFlowSplit}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {formattedFlowSplit.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
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
            )}

          </CardContent>
        </Card>

        {/* ===================================================
            MOOD TREND
            =================================================== */}

        <Card>
          <CardContent>

            <CardTitle className="mb-4">
              Mood trend
            </CardTitle>

            {formattedMoodTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No mood data logged yet.
              </p>
            ) : (
              <div className="h-56">

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formattedMoodTrend}
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
                      dataKey="label"
                      stroke="var(--muted-foreground)"
                      fontSize={11}
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
            )}

          </CardContent>
        </Card>

        {/* ===================================================
            SLEEP
            =================================================== */}

        <Card className="lg:col-span-2">
          <CardContent>

            <CardTitle className="mb-4">
              Sleep hours
            </CardTitle>

            {formattedSleepTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sleep data logged yet.
              </p>
            ) : (
              <div className="h-56">

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formattedSleepTrend}
                    margin={{ left: -20, right: 10 }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="label"
                      stroke="var(--muted-foreground)"
                      fontSize={11}
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

                    <Tooltip contentStyle={chartTooltip} />

                    <Bar
                      dataKey="hours"
                      fill="var(--sprout)"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  )
}