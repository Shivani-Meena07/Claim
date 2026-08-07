import React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full h-11 px-3.5 rounded-xl bg-input-background border border-border text-sm placeholder:text-muted-foreground focus-ring focus-visible:border-bloom',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium mb-1.5 block', className)} {...props} />
}
