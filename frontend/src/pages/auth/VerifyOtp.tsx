import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'

export default function VerifyOtp() {
  const [digits, setDigits] = useState(['', '', '', ''])
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const navigate = useNavigate()

  function handleChange(i: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[i] = value
    setDigits(next)
    if (value && i < 3) refs[i + 1].current?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  const complete = digits.every((d) => d !== '')

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 4-digit code we sent to you****@gmail.com.">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/app')
        }}
      >
        <div className="flex gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-14 text-center text-xl rounded-xl bg-input-background border border-border focus-ring focus-visible:border-bloom"
            />
          ))}
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={!complete}>
          Verify
        </Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Didn't get a code?{' '}
        <button className="text-bloom font-medium" type="button">
          Resend
        </button>
      </p>
    </AuthLayout>
  )
}
