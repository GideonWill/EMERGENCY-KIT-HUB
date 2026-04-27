import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CTA_PRIMARY } from '../config/brand'
import LoadingOverlay from '../components/LoadingOverlay'

export default function ResetPassword() {
  const { completeResetPassword } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await completeResetPassword(password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <LoadingOverlay message="Updating your password..." />}
      <div className="relative min-h-[calc(100vh-80px)] bg-slate-50 py-14 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="relative z-10 mx-auto w-full max-w-md bg-white/80 backdrop-blur-xl px-6 py-10 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5">
          <h1 className="text-center font-display text-4xl font-semibold tracking-tight text-slate-900">Reset Password</h1>
          
          {success ? (
            <div className="mt-10 space-y-6">
              <div className="border border-green-200 bg-green-50 p-4 text-sm text-green-800" role="alert">
                <p className="flex items-center gap-2 font-medium">
                  <span className="text-green-500 text-lg">✓</span> Password updated successfully!
                </p>
                <p className="mt-2 ml-7">You will be redirected to the login page in a few seconds.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className={`w-full py-4 text-sm font-semibold ${CTA_PRIMARY}`}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                  <p className="flex items-center gap-2">
                    <span className="text-red-500 text-lg">⚠</span> {error}
                  </p>
                </div>
              )}
              
              <p className="text-sm text-slate-600">
                Please enter your new password below.
              </p>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-none border border-slate-200 px-4 py-3.5 text-slate-900 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-slate-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-none border border-slate-200 px-4 py-3.5 text-slate-900 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-slate-300 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full rounded-none py-4 text-sm font-semibold active:scale-[0.98] transition-all duration-200 ${CTA_PRIMARY} shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40`}
              >
                {submitting ? 'Updating…' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
