import { Link } from 'react-router-dom'
import { CTA_PRIMARY } from '../config/brand'

/** Tip images: kit/supplies (non-human) + Black families where people appear (Unsplash) */
const tips = [
  {
    title: 'Read the kit guide first',
    body: 'Every Tobin emergency kit includes a printed guide. Review it with your household before you need it so everyone knows where supplies are stored and how items are organized.',
  },
  {
    title: 'Store in a cool, dry, accessible place',
    body: 'Keep the kit where adults can reach it quickly—often a pantry, hall closet, or dedicated shelf. Avoid damp basements or hot attics that can damage packaging or shorten shelf life.',
  },
  {
    title: 'Check dates and rotate supplies',
    body: 'Set a reminder every 3–6 months to check expiration dates on medications and supplies (when applicable). Replace water, batteries, and perishable items according to the manufacturer or your clinician.',
  },
  {
    title: 'Customize for your household',
    body: 'Add copies of emergency contacts, allergy lists, and extra items your family needs (e.g. infant supplies, pet food). This is general guidance—not a substitute for your doctor’s instructions.',
  },
  {
    title: 'Medications are personal',
    body: 'Prescription items must be used only as directed by a licensed provider. Never share medications. If you are unsure, contact your clinician or pharmacist.',
  },
  {
    title: 'Practice with your household',
    body: 'Twice a year, walk through where the kit lives and who grabs it in an outage or storm. A quick drill builds muscle memory so decisions are easier under stress.',
  },
]

export default function EmergencyKitHealthTips() {
  return (
    <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">Preparedness</p>
        <h2 className="mt-2 font-display text-3xl text-slate-900 sm:text-4xl">Health tips: using your emergency kit</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Practical steps to keep your kit ready. These tips are for general education only and do not replace professional
          medical advice or the instructions that ship with your specific products.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((t) => (
            <article
              key={t.title}
              className="flex flex-col overflow-hidden border border-slate-200 bg-slate-50/80 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg text-slate-900">{t.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className={`inline-flex px-8 py-3 text-sm ${CTA_PRIMARY}`}
          >
            Shop emergency kits
          </Link>
        </div>
      </div>
    </section>
  )
}
