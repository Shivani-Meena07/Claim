import React from 'react'
import { cn } from '../../lib/utils'

const tones = {
  bloom: 'bg-bloom-soft text-bloom',
  sprout: 'bg-sprout-soft text-sprout',
  sun: 'bg-sun-soft text-sun',
  dusk: 'bg-dusk-soft text-dusk',
  neutral: 'bg-muted text-muted-foreground',
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
      {...props}
    />
  )
}
