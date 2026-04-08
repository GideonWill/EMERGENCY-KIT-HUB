import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch, getApiBase } from '../lib/api'
import { COMPANY_NAME, CTA_PRIMARY, CTA_SECONDARY, SUPPORT_EMAIL } from '../config/brand'

export default function AppointmentBookingForm({
  defaultCategory = 'medical',
  title = 'Book an appointment',
  submitLabel = 'Submit request',
  /** Primary email for mailto (opens user’s mail app) */
  mailtoEmail = SUPPORT_EMAIL,
  /** Spiritual care: pick counsellor to address the email */
  counsellorOptions = [],
}) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [scheduledAt, setScheduledAt] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)
  const [selectedCounsellorEmail, setSelectedCounsellorEmail] = useState(
    () => counsellorOptions[0]?.email || mailtoEmail
  )

  const targetEmail =
    counsellorOptions.length > 0
      ? selectedCounsellorEmail || counsellorOptions[0].email
      : mailtoEmail

  function openMailto() {
    setFeedback('')
    if (!scheduledAt) {
      setFeedback('Choose a preferred date and time first.')
      return
    }
    const subject = encodeURIComponent(`Appointment request — ${defaultCategory} — ${COMPANY_NAME}`)
    const body = encodeURIComponent(
      `Preferred date/time: ${scheduledAt}\nTime label: ${timeSlot || '—'}\n\nNotes:\n${notes || '—'}\n\n— Sent from Tobin Emergency Kit Hub web form`
    )
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`
  }

  async function handleApiSubmit(e) {
    e.preventDefault()
    setFeedback('')
    if (!getApiBase()) {
      setFeedback('API URL not configured — use “Send by email” below.')
      return
    }
    if (!isAuthenticated) {
      navigate(`/login?next=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    if (!scheduledAt) {
      setFeedback('Choose a date and time.')
      return
    }
    setBusy(true)
    try {
      const iso = new Date(scheduledAt).toISOString()
      await apiFetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          scheduledAt: iso,
          timeSlot: timeSlot.trim() || undefined,
          notes: notes.trim() || undefined,
          category: defaultCategory,
        }),
      })
      setFeedback('success')
      setScheduledAt('')
      setTimeSlot('')
      setNotes('')
    } catch (err) {
      setFeedback(err.message || 'Could not book')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-xl text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">
        <strong className="text-slate-800">Send by email</strong> opens your mail app to{' '}
        <span className="font-mono text-xs text-brand-800">{targetEmail}</span>. Optional: signed-in users can also
        submit to our booking system when the API is connected.
      </p>
      {feedback === 'success' ? (
        <div className="mt-4 space-y-4">
          <p className="border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
            Request saved in our system. Our team will follow up.
          </p>
          <button
            type="button"
            onClick={() => setFeedback('')}
            className={`w-full py-3 text-sm ${CTA_SECONDARY}`}
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleApiSubmit} className="mt-6 space-y-4">
          {feedback && feedback !== 'success' && (
            <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{feedback}</p>
          )}
          {counsellorOptions.length > 0 && (
            <div>
              <label htmlFor="counsellor-pick" className="block text-sm font-medium text-slate-700">
                Counsellor
              </label>
              <select
                id="counsellor-pick"
                value={selectedCounsellorEmail}
                onChange={(e) => setSelectedCounsellorEmail(e.target.value)}
                className="mt-1 w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              >
                {counsellorOptions.map((c) => (
                  <option key={c.id} value={c.email}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="appt-when" className="block text-sm font-medium text-slate-700">
              Preferred date &amp; time
            </label>
            <input
              id="appt-when"
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
          <div>
            <label htmlFor="appt-slot" className="block text-sm font-medium text-slate-700">
              Time label (optional)
            </label>
            <input
              id="appt-slot"
              type="text"
              placeholder="e.g. Morning EST"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
          <div>
            <label htmlFor="appt-notes" className="block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="appt-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
          <button
            type="button"
            onClick={openMailto}
            className={`w-full py-3 text-sm ${CTA_PRIMARY}`}
          >
            Send request by email
          </button>
          {getApiBase() && (
            <button
              type="submit"
              disabled={busy}
              className={`w-full py-3 text-sm ${CTA_SECONDARY} disabled:opacity-60`}
            >
              {busy ? 'Sending…' : isAuthenticated ? submitLabel + ' (portal)' : 'Submit to portal (sign in required)'}
            </button>
          )}
        </form>
      )}
    </div>
  )
}
