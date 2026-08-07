import { useState } from 'react'
import { Play, Pause, Phone, Wind, Waves, TreePine, CloudRain, Music2, HeartHandshake } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const SOUNDS = [
  { id: 1, title: 'Rain on leaves', duration: '10 min', icon: CloudRain, tone: 'dusk' },
  { id: 2, title: 'Ocean waves', duration: '15 min', icon: Waves, tone: 'sprout' },
  { id: 3, title: 'Forest morning', duration: '12 min', icon: TreePine, tone: 'sun' },
  { id: 4, title: 'Guided meditation: releasing tension', duration: '8 min', icon: Music2, tone: 'bloom' },
]

export default function MentalWellness() {
  const [breathing, setBreathing] = useState(false)
  const [playingId, setPlayingId] = useState<number | null>(null)

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">Mental wellness</h1>
        <p className="text-muted-foreground mt-1">A few minutes of calm, whenever your day needs it.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Breathing circle */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center py-10">
          <div className="relative h-40 w-40 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-dusk-soft"
              style={{
                animation: breathing ? 'breathe 8s ease-in-out infinite' : 'none',
                transform: breathing ? undefined : 'scale(0.85)',
              }}
            />
            <div className="absolute inset-6 rounded-full bg-dusk/20" />
            <Wind size={28} className="relative text-dusk" />
          </div>
          <p className="text-sm font-medium mt-6">{breathing ? 'Breathe with the circle' : 'Ready when you are'}</p>
          <p className="text-xs text-muted-foreground mt-1 mb-5">4 seconds in, 4 seconds out</p>
          <Button variant={breathing ? 'outline' : 'primary'} onClick={() => setBreathing((b) => !b)}>
            {breathing ? 'Stop session' : 'Start 2-minute session'}
          </Button>
        </Card>

        {/* Sound / meditation cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {SOUNDS.map((s) => {
            const playing = playingId === s.id
            return (
              <Card key={s.id} className={playing ? 'border-bloom' : ''}>
                <CardContent className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `var(--${s.tone}-soft)`, color: `var(--${s.tone})` }}
                  >
                    <s.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.duration}</p>
                    {playing && (
                      <div className="flex items-end gap-0.5 h-4 mt-1.5" aria-hidden>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className="w-0.5 bg-bloom rounded-full"
                            style={{
                              animation: `breathe ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                              height: '100%',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setPlayingId(playing ? null : s.id)}
                    className="h-9 w-9 rounded-full bg-bloom text-white flex items-center justify-center shrink-0 focus-ring"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Crisis support card */}
      <Card className="bg-bloom-soft border-bloom/20">
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <HeartHandshake size={22} className="text-bloom shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-bloom">If you're struggling right now, you don't have to handle it alone.</p>
              <p className="text-sm text-bloom/80 mt-1">Crisis counselors are available 24/7, free and confidential.</p>
            </div>
          </div>
          <Button variant="danger" className="shrink-0">
            <Phone size={16} /> Get support now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
