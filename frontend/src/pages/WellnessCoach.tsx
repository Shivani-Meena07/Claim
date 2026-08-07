import { useState } from 'react'
import { Apple, Dumbbell, Sparkles as Lotus, Droplets, Moon, Heart, Sparkles, Clock } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'nutrition', label: 'Nutrition', icon: Apple },
  { key: 'exercise', label: 'Exercise', icon: Dumbbell },
  { key: 'yoga', label: 'Yoga', icon: Lotus },
  { key: 'hydration', label: 'Hydration', icon: Droplets },
  { key: 'sleep', label: 'Sleep', icon: Moon },
  { key: 'self-care', label: 'Self-care', icon: Heart },
]

const RECOMMENDATIONS = [
  { cat: 'nutrition', title: 'Iron-rich lunch bowl', desc: 'Spinach, lentils and citrus to replenish iron lost during your period.', time: '15 min', tone: 'bloom' },
  { cat: 'exercise', title: 'Low-impact strength circuit', desc: 'Gentle resistance work suited to lower energy during menstruation.', time: '20 min', tone: 'sprout' },
  { cat: 'yoga', title: 'Restorative hip-opener flow', desc: 'Ease cramping and lower-back tension with slow, supported poses.', time: '18 min', tone: 'dusk' },
  { cat: 'hydration', title: 'Electrolyte reminder', desc: 'Bloating is common right now — add a pinch of salt to your water today.', time: '2 min', tone: 'sun' },
  { cat: 'sleep', title: 'Wind-down breathing routine', desc: 'A 4-7-8 breathing pattern to help you fall asleep faster tonight.', time: '8 min', tone: 'dusk' },
  { cat: 'self-care', title: 'Warm compress ritual', desc: 'Heat therapy for cramps, paired with a 10-minute journaling prompt.', time: '15 min', tone: 'bloom' },
  { cat: 'exercise', title: 'High-intensity interval set', desc: 'Energy typically peaks now — a good day to push harder if you feel up to it.', time: '25 min', tone: 'sprout' },
  { cat: 'nutrition', title: 'Magnesium-rich snack plate', desc: 'Dark chocolate, almonds and banana to ease PMS symptoms.', time: '5 min', tone: 'bloom' },
  { cat: 'yoga', title: 'Energizing sun salutations', desc: 'A brisker flow to match your follicular-phase energy.', time: '12 min', tone: 'sprout' },
]

export default function WellnessCoach() {
  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? RECOMMENDATIONS : RECOMMENDATIONS.filter((r) => r.cat === active)

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">AI wellness coach</h1>
        <p className="text-muted-foreground mt-1">Recommendations tuned to your ovulation phase today.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm border transition-colors focus-ring ${
              active === c.key ? 'bg-bloom text-white border-bloom' : 'border-border hover:bg-muted'
            }`}
          >
            {c.icon && <c.icon size={14} />}
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r) => (
          <Card key={r.title} className="hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <Badge tone={r.tone as any}>{CATEGORIES.find((c) => c.key === r.cat)?.label}</Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} /> {r.time}
                </span>
              </div>
              <h3 className="font-display text-lg mb-1.5">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/60">
        <CardContent className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-bloom-soft text-bloom flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <p className="text-sm text-muted-foreground">
            Recommendations update automatically as your cycle phase changes — no need to reconfigure anything.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
