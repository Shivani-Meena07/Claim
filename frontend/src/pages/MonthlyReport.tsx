
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
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

const chartTooltip = { background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }

export default function MonthlyReport() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Monthly report</h1>
          <p className="text-muted-foreground mt-1">August 2026 summary</p>
        </div>
        <Button className="shrink-0">
          <Download size={16} /> Download PDF
        </Button>
      </div>

      {/* AI summary */}
      <Card className="bg-gradient-to-r from-dusk to-bloom text-white">
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} />
            <span className="text-sm font-medium">AI summary</span>
          </div>
          <p className="leading-relaxed text-white/90">
            Your cycle averaged 28 days this month, within your typical range. Mood dipped noticeably
            in week 3, correlating with lower sleep and higher cramp frequency — consider prioritizing
            rest during your luteal phase next cycle. Symptom logging was consistent, which is helping
            prediction accuracy stay high.
          </p>
        </CardContent>
      </Card>

      {/* Red flag detection */}
      <Card className="bg-sun-soft border-sun/20">
        <CardContent className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-sun shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sun">Worth a look: cycle length varied by 4 days this month</p>
            <p className="text-sm text-sun/80 mt-1">
              This is within normal variation for most people, but if it continues for 2+ more cycles, it may be worth mentioning to a doctor. Nothing urgent — just flagging it early.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardContent>
            <CardTitle className="mb-4">Cycle length (6 months)</CardTitle>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CYCLE_LENGTHS} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[24, 32]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltip} />
                  <Line type="monotone" dataKey="length" stroke="var(--bloom)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle className="mb-4">Symptom frequency</CardTitle>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SYMPTOM_FREQ} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="symptom" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltip} />
                  <Bar dataKey="count" fill="var(--dusk)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle className="mb-4">Flow intensity split</CardTitle>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={FLOW_SPLIT} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {FLOW_SPLIT.map((f) => (
                      <Cell key={f.name} fill={f.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltip} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle className="mb-4">Mood trend</CardTitle>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOOD_TREND} margin={{ left: -20, right: 10 }}>
                  <defs>
                    <linearGradient id="reportMoodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--sun)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--sun)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltip} />
                  <Area type="monotone" dataKey="mood" stroke="var(--sun)" strokeWidth={2.5} fill="url(#reportMoodGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent>
            <CardTitle className="mb-4">Sleep hours (weekly avg)</CardTitle>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SLEEP_TREND} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 9]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltip} />
                  <Bar dataKey="hours" fill="var(--sprout)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
