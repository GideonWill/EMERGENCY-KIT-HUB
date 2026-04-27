import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { CTA_PRIMARY } from '../config/brand'

/**
 * Inline sign-in or create account — used on Cart & Membership before Paystack.
 * Calls onAuthSuccess() after login or register completes.
 */
export default function AuthInlinePanel({
  onAuthSuccess,
  intro = 'Sign in to your account, or create one to continue securely with our company.',
}) {
  const { login, register, resetPassword } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResetMessage('')
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register({ email, password })
      }
      onAuthSuccess?.()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setError('Please enter your email to reset your password.')
      return
    }
    setError('')
    setResetMessage('')
    setBusy(true)
    try {
      await resetPassword(email)
      setResetMessage('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="border border-slate-200 bg-slate-50/80 p-6 rounded-none">
      <p className="text-sm font-medium text-slate-800">{intro}</p>
      <div className="mt-4 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setError('')
            setResetMessage('')
          }}
          className={`border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
            mode === 'login' ? 'border-brand-700 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register')
            setError('')
            setResetMessage('')
          }}
          className={`border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
            mode === 'register' ? 'border-brand-700 text-brand-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Create account
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {error && (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 rounded-none" role="alert">
            {error}
          </p>
        )}
        {resetMessage && (
          <p className="border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 rounded-none" role="alert">
            {resetMessage}
          </p>
        )}
        <div>
          <label htmlFor="inline-email" className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Email
          </label>
          <input
            id="inline-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="inline-password" className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Password {mode === 'register' && '(min 8 characters)'}
            </label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-[10px] font-bold uppercase tracking-wider text-brand-700 hover:text-brand-800 hover:underline"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <input
            id="inline-password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={mode === 'register' ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-none"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className={`w-full py-3 text-sm font-bold uppercase tracking-wide rounded-none ${CTA_PRIMARY}`}
        >
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in & continue' : 'Create account & continue'}
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-slate-500">
        Prefer the full page?{' '}
        <Link to="/login" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
          Sign in
        </Link>{' '}
        ·{' '}
        <Link to="/register" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}

