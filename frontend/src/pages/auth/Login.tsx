import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Label } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import api from '../../api'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      console.log('Login successful:', response.data)

      // Save JWT token
      localStorage.setItem('token', response.data.token)

      // Save user information if needed later
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      )

      navigate('/app')
    } catch (error: any) {
      console.error('Login error:', error)

      const message =
        error.response?.data?.message ||
        'Invalid email or password.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your cycle insights."
    >
      <form
        className="space-y-4"
        onSubmit={handleLogin}
      >
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <Link
              to="/forgot-password"
              className="text-xs text-bloom font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus-ring"
              aria-label={
                showPw ? 'Hide password' : 'Show password'
              }
            >
              {showPw ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Don't have an account?{' '}

        <Link
          to="/signup"
          className="text-bloom font-medium"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}