
import { Link } from 'react-router-dom'
import {
  Sparkles,
  CalendarHeart,
  Smile,
  MessageCircle,
  Wind,
  ArrowUpRight,
  Droplet,
  Moon,
  Flame,
  Activity,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { CycleWheel } from '../components/ui/CycleWheel'

const STATS = [
  { icon: Droplet, label: 'Cycle day', value: '16', sub: 'Ovulation phase', tone: 'sun' },
  { icon: Moon, label: 'Sleep last night', value: '7h 20m', sub: '+40m vs avg', tone: 'dusk' },
  { icon: Flame, label: 'Symptom intensity', value: 'Low', sub: '2 logged today', tone: 'sprout' },
  { icon: Activity, label: 'Mood avg (7d)', value: '4.2 / 5', sub: 'Trending up', tone: 'bloom' },
]

const QUICK_ACTIONS = [
  { to: '/app/cycle', label: 'Log today', icon: CalendarHeart },
  { to: '/app/mood', label: 'Log mood', icon: Smile },
  { to: '/app/chat', label: 'Ask AI coach', icon: MessageCircle },
  { to: '/app/mental-wellness', label: 'Breathe for 2 min', icon: Wind },
]

const ACTIVITY = [
  { text: 'Logged mood: Calm, energy 4/5', time: '2h ago' },
  { text: 'Completed 5-minute breathing session', time: '5h ago' },
  { text: 'Read: "Understanding luteal phase fatigue"', time: 'Yesterday' },
  { text: 'Booked consultation with Dr. Anjali Rao', time: '2 days ago' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Your day, at a glance</h1>
        <p className="text-muted-foreground mt-1">Friday, 7 August · Cycle day 16</p>
      </div>

      {/* AI insight banner */}
      <div className="rounded-2xl bg-gradient-to-r from-bloom to-dusk text-white p-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
        <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <p className="font-display text-lg">You're likely in your fertile window</p>
          <p className="text-white/80 text-sm mt-1">
            Based on your last 4 cycles, ovulation is predicted for today or tomorrow. Energy and libido often peak now — a good window for higher-intensity workouts.
          </p>
        </div>
        <Link
          to="/app/cycle"
          className="inline-flex items-center gap-1.5 bg-white text-primary text-sm font-medium px-4 py-2.5 rounded-xl whitespace-nowrap self-start md:self-center"
        >
          View details <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="font-display text-2xl mt-1.5">{s.value}</p>
                <p className="text-xs mt-1" style={{ color: `var(--${s.tone})` }}>
                  {s.sub}
                </p>
              </div>
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `var(--${s.tone}-soft)`, color: `var(--${s.tone})` }}
              >
                <s.icon size={18} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Cycle wheel snapshot */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center py-8">
          <CycleWheel size={200} currentDay={16} />
          <Link to="/app/cycle" className="text-sm text-bloom font-medium mt-5">
            Open cycle tracker →
          </Link>
        </Card>

        {/* Quick actions */}
        <Card className="lg:col-span-1">
          <CardContent>
            <h3 className="font-display text-lg mb-4">Quick actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex flex-col items-start gap-2.5 p-4 rounded-xl border border-border hover:border-bloom hover:bg-bloom-soft/40 transition-colors"
                >
                  <a.icon size={18} className="text-bloom" />
                  <span className="text-sm font-medium">{a.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-1">
          <CardContent>
            <h3 className="font-display text-lg mb-4">Recent activity</h3>
            <ul className="space-y-4">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-bloom mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
