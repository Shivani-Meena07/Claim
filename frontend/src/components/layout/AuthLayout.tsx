import React from 'react'
import { Link } from 'react-router-dom'
import { CycleWheel } from '../ui/CycleWheel'

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <Link to="/" className="font-display text-xl mb-10">
          Claim
        </Link>
        <div className="max-w-sm w-full">
          <h1 className="font-display text-3xl mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bloom/20 via-transparent to-dusk/20" />
        <div className="relative bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur">
          <CycleWheel size={260} currentDay={9} />
        </div>
      </div>
    </div>
  )
}
