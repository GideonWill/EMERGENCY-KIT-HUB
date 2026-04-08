import { Link } from 'react-router-dom'
import { CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import AppointmentBookingForm from '../components/AppointmentBookingForm'
import { practitioners } from '../data/careTeam'

export default function Consultation() {
  return (
    <div className="bg-white">
      <div className="border-b border-slate-200 bg-brand-50/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">Clinical consultation</p>
          <h1 className="mt-3 font-display text-4xl text-slate-900 sm:text-5xl">Meet our health practitioners</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Book a virtual or phone consultation with licensed clinicians who can answer general health
            questions, review your wellness goals, and guide next steps. This demo site uses placeholder
            profiles — always follow your own doctor&apos;s advice for medical decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#book"
              className={`inline-flex px-6 py-3 text-sm ${CTA_PRIMARY}`}
            >
              Request a consultation
            </a>
            <Link
              to="/spiritual-guidance"
              className={`inline-flex px-6 py-3 text-sm ${CTA_SECONDARY}`}
            >
              Spiritual guidance (CoP)
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl text-slate-900 sm:text-3xl">Practitioner team</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Each provider below represents a layout slot. In production, sync this list with your scheduling
          system and state licensure.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practitioners.map((p) => (
            <article key={p.id} className="flex flex-col border border-slate-200 bg-white shadow-sm">
              <img src={p.image} alt="" className="aspect-[4/3] w-full object-cover object-top" />
              <div className="flex flex-1 flex-col border-t border-slate-200 p-5">
                <h3 className="font-display text-xl text-slate-900">{p.name}</h3>
                <p className="text-sm font-semibold text-brand-700">{p.title}</p>
                {p.phone && (
                  <p className="mt-2 text-sm text-slate-800">
                    <a
                      href={`tel:${p.phone.replace(/\s/g, '')}`}
                      className="font-medium text-brand-800 hover:underline"
                    >
                      {p.phone}
                    </a>
                  </p>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.bio}</p>
                <Link
                  to="/contact"
                  className={`mt-5 inline-flex w-full items-center justify-center py-2.5 text-center text-sm ${CTA_PRIMARY}`}
                >
                  Inquire about availability
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section id="book" className="border-t border-slate-200 bg-slate-50 py-14 scroll-mt-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <AppointmentBookingForm
            defaultCategory="medical"
            title="Book a clinical consultation"
            submitLabel="Request consultation"
            counsellorOptions={practitioners.map((x) => ({
              id: x.id,
              name: x.name,
              email: x.email,
            }))}
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className={`inline-flex px-8 py-3 text-sm ${CTA_PRIMARY}`}
            >
              Contact care team
            </Link>
            <Link
              to="/membership"
              className={`inline-flex px-8 py-3 text-sm ${CTA_SECONDARY}`}
            >
              View membership options
            </Link>
          </div>
          <p className="mt-8 text-center text-xs text-slate-500">
            <strong className="text-slate-700">Not for emergencies.</strong> If you are in crisis, call
            your local emergency number or a crisis hotline (e.g. 988 in the U.S.).
          </p>
        </div>
      </section>
    </div>
  )
}
