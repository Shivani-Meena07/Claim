

// Signature element: a radial "cycle wheel" showing the four phases as arcs,
// with a marker that sweeps to the current day. Pure SVG, CSS-var driven.

interface Phase {
  name: string
  color: string
  days: number
}

const PHASES: Phase[] = [
  { name: 'Menstrual', color: 'var(--bloom)', days: 5 },
  { name: 'Follicular', color: 'var(--sprout)', days: 8 },
  { name: 'Ovulation', color: 'var(--sun)', days: 3 },
  { name: 'Luteal', color: 'var(--dusk)', days: 12 },
]

const TOTAL = PHASES.reduce((s, p) => s + p.days, 0)

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

export function CycleWheel({
  size = 320,
  currentDay = 14,
  animated = true,
}: {
  size?: number
  currentDay?: number
  animated?: boolean
}) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.36
  const strokeW = size * 0.09

  let cursor = 0
  const arcs = PHASES.map((p) => {
    const startAngle = (cursor / TOTAL) * 360
    cursor += p.days
    const endAngle = (cursor / TOTAL) * 360
    return { ...p, startAngle, endAngle }
  })

  const markerAngle = (currentDay / TOTAL) * 360
  const markerPos = polarToCartesian(cx, cy, r, markerAngle)
  const activePhase =
    arcs.find((a) => markerAngle >= a.startAngle && markerAngle <= a.endAngle) ?? arcs[0]

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={animated ? 'animate-[float-slow_6s_ease-in-out_infinite]' : ''}
      >
        {arcs.map((a) => (
          <path
            key={a.name}
            d={arcPath(cx, cy, r, a.startAngle + 2, a.endAngle - 2)}
            fill="none"
            stroke={a.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}
        {/* day marker */}
        <circle cx={markerPos.x} cy={markerPos.y} r={strokeW * 0.55} fill="var(--paper)" stroke={activePhase.color} strokeWidth={3} />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="font-display text-3xl" style={{ color: activePhase.color as string }}>
          Day {currentDay}
        </span>
        <span className="text-sm text-muted-foreground mt-1">{activePhase.name} phase</span>
      </div>
    </div>
  )
}

export { PHASES, TOTAL }
