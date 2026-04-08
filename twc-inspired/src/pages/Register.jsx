import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isDemoMode } from '../config/demoMode'
import { CTA_PRIMARY } from '../config/brand'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setSubmitting(false)
      return
    }
    
    try {
      await register({ email, password, firstName, lastName, phone, rememberMe })
      navigate('/', { replace: true })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.')
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50 py-14">
      <div className="mx-auto max-w-md border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-8">
        <h1 className="font-display text-3xl text-slate-900">Create account</h1>
          {isDemoMode() && (
            <>
              <strong className="text-amber-900">Demo mode:</strong> use any email and a password of at least 8 characters — no server required.
            </>
          )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-first-name" className="block text-sm font-medium text-slate-700">
                First Name
              </label>
              <input
                id="reg-first-name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>
            <div>
              <label htmlFor="reg-last-name" className="block text-sm font-medium text-slate-700">
                Last Name
              </label>
              <input
                id="reg-last-name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
          <div>
            <label htmlFor="reg-phone" className="block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              id="reg-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700">
                Password (min 8 chars)
              </label>
              <div className="relative mt-1">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
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
            <div>
              <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="reg-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
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
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
