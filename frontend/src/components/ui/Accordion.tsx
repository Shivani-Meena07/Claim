import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between py-5 text-left focus-ring"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="font-display text-base md:text-lg pr-6">{item.q}</span>
            <ChevronDown
              size={20}
              className={cn('shrink-0 transition-transform text-muted-foreground', open === i && 'rotate-180')}
            />
          </button>
          <div
            className={cn(
              'grid transition-all duration-300 ease-out',
              open === i ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'
            )}
          >
            <div className="overflow-hidden">
              <p className="text-muted-foreground leading-relaxed max-w-2xl">{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
