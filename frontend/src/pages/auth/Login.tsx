import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Label } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your cycle insights.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/app')
        }}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-bloom font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" required />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus-ring"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full mt-2">
          Log in
        </Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-bloom font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
