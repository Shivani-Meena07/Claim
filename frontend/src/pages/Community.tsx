import { useState } from 'react'
import { Search, Heart, MessageSquare, Share2, TrendingUp, PlusCircle } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

const POSTS = [
  {
    id: 1,
    author: 'Anonymous Lotus',
    time: '2h ago',
    tag: 'Symptoms',
    text: "Anyone else get really bad lower back pain the day before their period starts? Heat pads help a little but wondering what else works.",
    likes: 34,
    comments: 12,
  },
  {
    id: 2,
    author: 'Anonymous Willow',
    time: '5h ago',
    tag: 'Mental health',
    text: "Finally told my manager I needed a flexible day during my period. Was terrified but she was completely understanding. Wish I'd done this years ago.",
    likes: 128,
    comments: 27,
  },
  {
    id: 3,
    author: 'Anonymous Iris',
    time: '1d ago',
    tag: 'PCOS',
    text: 'Got diagnosed with PCOS last month. Feeling overwhelmed by all the conflicting advice online — would love to hear what actually helped people here.',
    likes: 89,
    comments: 41,
  },
]

const TRENDING = ['#IrregularPeriods', '#PCOSsupport', '#PostpartumBody', '#FertilityJourney', '#PeriodPoverty']

export default function Community() {
  const [query, setQuery] = useState('')
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  function toggleLike(id: number) {
    setLiked((l) => ({ ...l, [id]: !l[id] }))
  }

  const filtered = POSTS.filter((p) => p.text.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">Community</h1>
          <p className="text-muted-foreground mt-1">Ask, share and hear from people on the same path — fully anonymous.</p>
        </div>
        <Button className="shrink-0">
          <PlusCircle size={16} /> New post
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-input-background border border-border text-sm focus-ring focus-visible:border-bloom"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((post) => (
            <Card key={post.id}>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-dusk-soft text-dusk flex items-center justify-center text-xs font-medium">
                      {post.author.split(' ')[1][0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                  <Badge tone="dusk">{post.tag}</Badge>
                </div>
                <p className="text-sm leading-relaxed mb-4">{post.text}</p>
                <div className="flex items-center gap-5 text-sm text-muted-foreground">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 focus-ring ${liked[post.id] ? 'text-bloom' : 'hover:text-foreground'}`}
                  >
                    <Heart size={16} fill={liked[post.id] ? 'currentColor' : 'none'} />
                    {post.likes + (liked[post.id] ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-foreground focus-ring">
                    <MessageSquare size={16} /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-foreground focus-ring">
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-10 text-center">No posts match "{query}".</p>
          )}
        </div>

        <Card className="h-fit">
          <CardContent>
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={17} className="text-bloom" /> Trending
            </h3>
            <ul className="space-y-3">
              {TRENDING.map((t) => (
                <li key={t}>
                  <button className="text-sm text-bloom hover:underline">{t}</button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
