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
  const [rememberMe, setRememberMe] = useState(false)
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
    <div className="relative min-h-[calc(100vh-80px)] bg-slate-50 py-14 flex items-center justify-center overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="relative z-10 mx-auto w-full max-w-md bg-white/80 backdrop-blur-xl px-6 py-10 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5 sm:rounded-2xl sm:px-10">
        <h1 className="text-center font-display text-4xl font-semibold tracking-tight text-slate-900">Sign in</h1>
          {isDemoMode() && (
            <p className="mt-3 text-center text-sm text-slate-600">
              <strong className="text-amber-900">Demo mode:</strong> use any email and a short password — no server required.
            </p>
          )}
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm" role="alert">
              <p className="flex items-center gap-2">
                <span className="text-red-500 text-lg">⚠</span> {error}
              </p>
            </div>
          )}
          {resetMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm" role="alert">
              <p className="flex items-center gap-2">
                <span className="text-green-500 text-lg">✓</span> {resetMessage}
              </p>
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-slate-900 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-slate-300 bg-white"
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
                className="text-sm font-medium text-brand-600 outline-none hover:text-brand-700 focus:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative mt-2">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 pr-14 text-slate-900 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                )}
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
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 focus:ring-offset-1 transition-all"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full rounded-xl py-4 text-sm font-semibold active:scale-[0.98] transition-all duration-200 ${CTA_PRIMARY} shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40`}
          >
            {submitting ? 'Signing in…' : 'Sign in to your account'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">
          First time here?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
