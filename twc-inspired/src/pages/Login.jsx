import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isDemoMode } from '../config/demoMode'
import { CTA_PRIMARY } from '../config/brand'

export default function Login() {
  const { login, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password, rememberMe)
      navigate(next.startsWith('/') ? next : '/', { replace: true })
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.')
      } else {
        setError(err.message || 'Login failed. Please verify your credentials and try again.')
      }
      setSubmitting(false)
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setError('Please enter your email to reset your password.')
      return
    }
    setError('')
    setResetMessage('')
    try {
      await resetPassword(email)
      setResetMessage('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    }
  }

  return (
    <div className="bg-slate-50 py-14">
      <div className="mx-auto max-w-md border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-8">
        <h1 className="font-display text-3xl text-slate-900">Sign in</h1>
          {isDemoMode() && (
            <>
              <strong className="text-amber-900">Demo mode:</strong> use any email and a password of at least 4 characters — no server required.
            </>
          )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}
          {resetMessage && (
            <p className="border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800" role="alert">
              {resetMessage}
            </p>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm font-medium text-brand-600 hover:text-brand-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative mt-1">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 text-sm ${CTA_PRIMARY}`}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
