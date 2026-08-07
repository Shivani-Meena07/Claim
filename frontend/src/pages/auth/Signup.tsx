import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Label } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import api from '../../api'

export default function Signup() {
  const [showPw, setShowPw] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
      })

      console.log('Signup successful:', response.data)

      navigate('/login')
    } catch (error: any) {
      console.error('Signup error:', error)

      const message =
        error.response?.data?.message ||
        'Unable to create account. Please try again.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start understanding your cycle in minutes."
    >
      <form
        className="space-y-4"
        onSubmit={handleSignup}
      >
        <div>
          <Label htmlFor="name">Full name</Label>

          <Input
            id="name"
            type="text"
            placeholder="Meera Shah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="At least 8 characters"
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

        <label className="flex items-start gap-2.5 text-sm text-muted-foreground pt-1">
          <input
            type="checkbox"
            required
            className="mt-0.5 accent-bloom"
          />

          I agree to the Terms of Service and Privacy Policy.
        </label>

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
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already have an account?{' '}

        <Link
          to="/login"
          className="text-bloom font-medium"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}