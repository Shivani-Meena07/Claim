
import { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  Phone,
  Wind,
  Waves,
  TreePine,
  CloudRain,
  Music2,
  HeartHandshake,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

import rainSound from '../assets/sounds/rain.wav'
import oceanSound from '../assets/sounds/ocean.wav'
import natureSound from '../assets/sounds/nature.wav'
import meditationSound from '../assets/sounds/meditation.mp3'

const SOUNDS = [
  {
    id: 1,
    title: 'Rain on leaves',
    duration: '10 min',
    icon: CloudRain,
    tone: 'dusk',
    src: rainSound,
  },
  {
    id: 2,
    title: 'Ocean waves',
    duration: '15 min',
    icon: Waves,
    tone: 'sprout',
    src: oceanSound,
  },
  {
    id: 3,
    title: 'Forest morning',
    duration: '12 min',
    icon: TreePine,
    tone: 'sun',
    src: natureSound,
  },
  {
    id: 4,
    title: 'Guided meditation: releasing tension',
    duration: '8 min',
    icon: Music2,
    tone: 'bloom',
    src: meditationSound,
  },
]

const SESSION_DURATION = 2 * 60

export default function MentalWellness() {
  const [breathing, setBreathing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [playingId, setPlayingId] = useState<number | null>(null)

  // Keep track of the currently playing audio
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Breathing session timer
  useEffect(() => {
    if (!breathing) return

    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(timer)
          setBreathing(false)
          setSessionComplete(true)
          return 0
        }

        return currentTime - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [breathing])

  // Stop audio when leaving the page
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  const startBreathing = () => {
    setTimeLeft(SESSION_DURATION)
    setSessionComplete(false)
    setBreathing(true)
  }

  const stopBreathing = () => {
    setBreathing(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSoundClick = (sound: (typeof SOUNDS)[number]) => {
    const isCurrentlyPlaying = playingId === sound.id

    // If clicking the currently playing sound, pause it
    if (isCurrentlyPlaying && audioRef.current) {
      audioRef.current.pause()
      setPlayingId(null)
      return
    }

    // Stop any previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    // Create the new audio
    const audio = new Audio(sound.src)

    audio.loop = true

    // When audio finishes/stops naturally
    audio.onended = () => {
      setPlayingId(null)
    }

    // Handle playback errors
    audio.onerror = () => {
      console.error(`Unable to play audio: ${sound.title}`)
      setPlayingId(null)
    }

    audioRef.current = audio

    // Start playback
    audio
      .play()
      .then(() => {
        setPlayingId(sound.id)
      })
      .catch((error) => {
        console.error('Audio playback failed:', error)
        setPlayingId(null)
      })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Mental wellness</h1>
        <p className="text-muted-foreground mt-1">
          A few minutes of calm, whenever your day needs it.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Breathing circle */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center py-10">
          <div className="relative h-40 w-40 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full bg-dusk-soft"
              style={{
                animation: breathing
                  ? 'breathe 8s ease-in-out infinite'
                  : 'none',
                transform: breathing ? undefined : 'scale(0.85)',
              }}
            />

            <div className="absolute inset-6 rounded-full bg-dusk/20" />

            <Wind size={28} className="relative text-dusk" />
          </div>

          <p className="text-sm font-medium mt-6">
            {breathing
              ? 'Breathe with the circle'
              : sessionComplete
                ? 'Session complete'
                : 'Ready when you are'}
          </p>

          <p className="text-xs text-muted-foreground mt-1 mb-2">
            {breathing
              ? '4 seconds in, 4 seconds out'
              : sessionComplete
                ? 'Well done. Take a moment to notice how you feel.'
                : '4 seconds in, 4 seconds out'}
          </p>

          <p className="text-lg font-semibold text-dusk mb-4">
            {formatTime(timeLeft)}
          </p>

          {breathing ? (
            <Button variant="outline" onClick={stopBreathing}>
              Stop session
            </Button>
          ) : (
            <Button variant="primary" onClick={startBreathing}>
              {sessionComplete ? 'Start again' : 'Start 2-minute session'}
            </Button>
          )}
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
                    style={{
                      background: `var(--${s.tone}-soft)`,
                      color: `var(--${s.tone})`,
                    }}
                  >
                    <s.icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {s.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {s.duration}
                    </p>

                    {playing && (
                      <div
                        className="flex items-end gap-0.5 h-4 mt-1.5"
                        aria-hidden
                      >
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className="w-0.5 bg-bloom rounded-full"
                            style={{
                              animation: `breathe ${
                                0.6 + i * 0.15
                              }s ease-in-out infinite alternate`,
                              height: '100%',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSoundClick(s)}
                    className="h-9 w-9 rounded-full bg-bloom text-white flex items-center justify-center shrink-0 focus-ring"
                    aria-label={playing ? `Pause ${s.title}` : `Play ${s.title}`}
                  >
                    {playing ? (
                      <Pause size={15} />
                    ) : (
                      <Play size={15} className="ml-0.5" />
                    )}
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
            <HeartHandshake
              size={22}
              className="text-bloom shrink-0 mt-0.5"
            />

            <div>
              <p className="font-medium text-bloom">
                If you're struggling right now, you don't have to handle it
                alone.
              </p>

              <p className="text-sm text-bloom/80 mt-1">
                Crisis counselors are available 24/7, free and confidential.
              </p>
            </div>
          </div>

          <Button variant="danger" className="shrink-0">
            <Phone size={16} />
            Get support now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
