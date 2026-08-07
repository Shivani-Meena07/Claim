import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const MOODS = [
  { emoji: '😢', label: 'Low', value: 1 },
  { emoji: '😕', label: 'Down', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😄', label: 'Great', value: 5 },
]

const HISTORY = [
  { day: 'Mon', mood: 3, note: 'Bit tired, low motivation' },
  { day: 'Tue', mood: 4, note: 'Good energy, productive day' },
  { day: 'Wed', mood: 2, note: 'Cramping, irritable' },
  { day: 'Thu', mood: 3, note: 'Steady, ok' },
  { day: 'Fri', mood: 4, note: 'Great workout, upbeat' },
  { day: 'Sat', mood: 5, note: 'Relaxed weekend, high energy' },
  { day: 'Sun', mood: 4, note: 'Calm, content' },
]

export default function MoodTracker() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Mood tracker</h1>
        <p className="text-muted-foreground mt-1">How are you feeling right now?</p>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-wrap justify-between gap-4">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelected(m.value)}
                className={`flex-1 min-w-[90px] flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all focus-ring ${
                  selected === m.value ? 'border-bloom bg-bloom-soft scale-105' : 'border-border hover:bg-muted'
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
          <textarea
            placeholder="Add a note about today (optional)"
            rows={2}
            className="w-full mt-5 p-3.5 rounded-xl bg-input-background border border-border text-sm placeholder:text-muted-foreground focus-ring focus-visible:border-bloom resize-none"
          />
          <Button className="mt-4" disabled={selected === null}>
            Save mood
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="font-display text-lg mb-1">This week's trend</h3>
          <p className="text-sm text-muted-foreground mb-5">Mood tends to dip mid-cycle and lift on weekends.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORY} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--bloom)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--bloom)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }}
                />
                <Area type="monotone" dataKey="mood" stroke="var(--bloom)" strokeWidth={2.5} fill="url(#moodGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="font-display text-lg mb-4">Timeline</h3>
          <ul className="space-y-4">
            {HISTORY.slice().reverse().map((h) => (
              <li key={h.day} className="flex items-center gap-4">
                <span className="text-2xl w-8">{MOODS.find((m) => m.value === h.mood)?.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{h.day}</p>
                  <p className="text-xs text-muted-foreground">{h.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
