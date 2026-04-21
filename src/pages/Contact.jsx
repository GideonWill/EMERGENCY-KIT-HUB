import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CTA_PRIMARY, SUPPORT_EMAIL } from '../config/brand'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialTopic = searchParams.get('topic')
  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState('General question')

  useEffect(() => {
    if (initialTopic === 'institutional') {
      setTopic('Institutional / Corporate inquiry')
    }
  }, [initialTopic])

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const topic = formData.get('topic')
    const message = formData.get('message')
    const name = formData.get('name')
    
    const waText = encodeURIComponent(`Message from ${name}\nTopic: ${topic}\n\n${message}`)
    window.open(`https://wa.me/233592678531?text=${waText}`, '_blank')
    setSent(true)
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Contact</p>
            <h1 className="mt-2 font-display text-4xl text-slate-900">We&apos;re here to help</h1>
            <p className="mt-4 text-lg text-slate-600">
              Questions about membership, shipping, or products? Send a message — this form is a UI
              placeholder (no backend).
            </p>
            <dl className="mt-10 space-y-6 text-slate-700">
              <div>
                <dt className="text-sm font-semibold text-slate-500">Phone</dt>
                <dd className="mt-1">0592678531</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-800 hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500">Hours</dt>
                <dd className="mt-1">Mon–Fri, 9am–6pm ET</dd>
              </div>
            </dl>
          </div>

          <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {sent ? (
              <p className="py-12 text-center text-lg text-brand-700">
                Thanks — your message would be sent in a real app.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-brand-600 focus:border-brand-600 focus:ring-2"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-brand-600 focus:border-brand-600 focus:ring-2"
                  />
                </div>
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-brand-600 focus:border-brand-600 focus:ring-2"
                  >
                    <option>General question</option>
                    <option>Order support</option>
                    <option>Membership</option>
                    <option>Institutional / Corporate inquiry</option>
                    <option>Provider / clinical</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 w-full border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-brand-600 focus:border-brand-600 focus:ring-2"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-3.5 text-sm ${CTA_PRIMARY}`}
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
