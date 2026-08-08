
import { useEffect, useState } from 'react'
import {
  Apple,
  Dumbbell,
  Sparkles as Lotus,
  Droplets,
  Moon,
  Heart,
  Sparkles,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { getWellnessRecommendations } from '../api'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'nutrition', label: 'Nutrition', icon: Apple },
  { key: 'exercise', label: 'Exercise', icon: Dumbbell },
  { key: 'yoga', label: 'Yoga', icon: Lotus },
  { key: 'hydration', label: 'Hydration', icon: Droplets },
  { key: 'sleep', label: 'Sleep', icon: Moon },
  { key: 'self-care', label: 'Self-care', icon: Heart },
]

type Recommendation = {
  category: string
  title: string
  description: string
  time: string
}

export default function WellnessCoach() {
  const [active, setActive] = useState('all')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getWellnessRecommendations()

        setRecommendations(data.recommendations || [])
      } catch (err: any) {
        console.error('Wellness recommendations error:', err)

        if (err.response?.status === 429) {
          setError(
            err.response?.data?.message ||
              'AI wellness recommendations are temporarily unavailable because the Gemini API quota has been reached.'
          )
        } else {
          setError(
            err.response?.data?.message ||
              'Failed to load wellness recommendations.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const filtered =
    active === 'all'
      ? recommendations
      : recommendations.filter((r) => r.category === active)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">AI wellness coach</h1>
        <p className="text-muted-foreground mt-1">
          Personalized recommendations based on your wellness data.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm border transition-colors focus-ring ${
              active === c.key
                ? 'bg-bloom text-white border-bloom'
                : 'border-border hover:bg-muted'
            }`}
          >
            {c.icon && <c.icon size={14} />}
            {c.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item}>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-12 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && error && (
        <Card className="border-red-200">
          <CardContent className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="font-medium">
                AI recommendations temporarily unavailable
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                {error}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recommendations available for this category.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => {
            const category = CATEGORIES.find(
              (c) => c.key === r.category
            )

            return (
              <Card
                key={r.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <Badge tone="bloom">
                      {category?.label || r.category}
                    </Badge>

                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {r.time}
                    </span>
                  </div>

                  <h3 className="font-display text-lg mb-1.5">
                    {r.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {r.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="bg-muted/60">
        <CardContent className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-bloom-soft text-bloom flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>

          <p className="text-sm text-muted-foreground">
            Recommendations update automatically using your logged cycle,
            mood, and sleep data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
