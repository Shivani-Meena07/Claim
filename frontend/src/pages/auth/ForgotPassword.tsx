import  { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Label } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email linked to your account and we'll send a reset link."
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <div className="h-12 w-12 rounded-full bg-sprout-soft text-sprout flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <p className="font-medium">Check your inbox</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            We've sent a password reset link to your email. It expires in 15 minutes.
          </p>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <Button type="submit" size="lg" className="w-full mt-2">
            Send reset link
          </Button>
        </form>
      )}
      <p className="text-sm text-muted-foreground mt-6 text-center">
        <Link to="/login" className="text-bloom font-medium">
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  )
}
