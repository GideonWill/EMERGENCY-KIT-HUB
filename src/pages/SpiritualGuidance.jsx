import { Link } from 'react-router-dom'
import { CTA_PRIMARY } from '../config/brand'
import AppointmentBookingForm from '../components/AppointmentBookingForm'
import { spiritualCounselors } from '../data/careTeam'

export default function SpiritualGuidance() {
  return (
    <div className="bg-white">
      <div className="border-b border-slate-200 bg-gradient-to-b from-slate-900 to-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200">
            The Church of Pentecost · Pastoral care
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Spiritual guidance &amp; counsel</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100/95">
            As a member of The Church of Pentecost, you can receive caring support from trained
            counsellors and ministers who listen, pray with you, and encourage you with the Word of God.
            Spiritual care complements medical care — it does not replace diagnosis, treatment, or
            emergency services.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#counsellors"
              className="inline-flex border-2 border-amber-400 bg-amber-400 px-6 py-3 text-sm font-semibold text-brand-950 shadow-md transition hover:border-amber-300 hover:bg-amber-300"
            >
              Meet our counsellors
            </a>
            <Link
              to="/consultation"
              className="inline-flex border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-white/10"
            >
              Clinical consultation
            </Link>
            <a
              href="#book-spiritual"
              className="inline-flex border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-white/10"
            >
              Book spiritual session
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-2xl text-slate-900">What to expect</h2>
            <ul className="mt-4 space-y-4 text-slate-600">
              <li className="flex gap-3 border-l-4 border-brand-600 pl-4">
                <span>
                  <strong className="text-slate-900">Confidential conversation</strong> — A safe space to
                  share burdens, ask for prayer, and reflect on Scripture.
                </span>
              </li>
              <li className="flex gap-3 border-l-4 border-brand-600 pl-4">
                <span>
                  <strong className="text-slate-900">Biblical encouragement</strong> — Counsellors point to
                  Christ and the Scriptures for hope, repentance, forgiveness, and perseverance.
                </span>
              </li>
              <li className="flex gap-3 border-l-4 border-brand-600 pl-4">
                <span>
                  <strong className="text-slate-900">Whole-person care</strong> — We honour both spiritual
                  and physical health; serious symptoms should always be discussed with a qualified
                  clinician.
                </span>
              </li>
            </ul>
          </div>
          <blockquote className="border border-slate-200 bg-brand-50/40 p-6 text-slate-700">
            <p className="font-display text-lg italic text-slate-900">
              &ldquo;Come to me, all you who are weary and burdened, and I will give you rest.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-slate-600">— Matthew 11:28 (NIV)</footer>
          </blockquote>
        </div>
      </div>

      <div id="counsellors" className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl text-slate-900 sm:text-3xl">Church counsellors &amp; ministers</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Placeholder profiles for CoP-aligned pastoral counsellors. Replace with your assembly&apos;s
            approved roster and scheduling process.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spiritualCounselors.map((c) => (
              <article key={c.id} className="flex flex-col border border-slate-200 bg-white shadow-sm">
                <img src={c.image} alt="" className="aspect-[4/3] w-full object-cover object-top" />
                <div className="flex flex-1 flex-col border-t border-slate-200 p-5">
                  <h3 className="font-display text-xl text-slate-900">{c.name}</h3>
                  <p className="text-sm font-semibold text-brand-700">{c.title}</p>
                  {c.phone && (
                    <p className="mt-2 text-sm text-slate-800">
                      <a
                        href={`tel:${c.phone.replace(/\s/g, '')}`}
                        className="font-medium text-brand-800 hover:underline"
                      >
                        {c.phone}
                      </a>
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{c.bio}</p>
                  <a
                    href="#book-spiritual"
                    className={`mt-5 inline-flex w-full items-center justify-center py-2.5 text-center text-sm ${CTA_PRIMARY}`}
                  >
                    Request spiritual counsel
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section id="book-spiritual" className="border-t border-slate-200 bg-slate-50 py-14 scroll-mt-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <AppointmentBookingForm
            defaultCategory="spiritual"
            title="Request spiritual counsel"
            submitLabel="Submit pastoral care request"
            counsellorOptions={spiritualCounselors.map((x) => ({
              id: x.id,
              name: x.name,
              email: x.email,
            }))}
          />
        </div>
      </section>

      <section className="border-t border-slate-200 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-xl text-slate-900">Need help right now?</h2>
          <p className="mt-3 text-sm text-slate-600">
            If you or someone else is in immediate danger, contact local emergency services. For emotional
            distress, consider a national crisis line in your country.
          </p>
          <Link
            to="/contact"
            className={`mt-6 inline-flex px-8 py-3 text-sm ${CTA_PRIMARY}`}
          >
            Message our team
          </Link>
        </div>
      </section>
    </div>
  )
}
