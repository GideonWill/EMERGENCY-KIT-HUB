import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { CTA_PRIMARY } from '../config/brand'

/**
 * Inline sign-in or create account — used on Cart & Membership before Stripe.
 * Calls onAuthSuccess() after login or register completes.
 */
export default function AuthInlinePanel({
  onAuthSuccess,
  intro = 'Sign in to your account, or create one to continue securely with our company.',
}) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
      onAuthSuccess?.()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="border border-slate-200 bg-slate-50/80 p-6">
      <p className="text-sm font-medium text-slate-800">{intro}</p>
      <div className="mt-4 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setError('')
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
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
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
            className="mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div>
          <label htmlFor="inline-password" className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Password {mode === 'register' && '(min 8 characters)'}
          </label>
          <input
            id="inline-password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={mode === 'register' ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className={`w-full py-3 text-sm ${CTA_PRIMARY}`}
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
