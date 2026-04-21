import { Link } from 'react-router-dom'
import { COMPANY_NAME, LOGO_SRC } from '../config/brand'

const footerColumns = [
  {
    title: 'Shop',
    links: [
      { to: '/shop', label: 'All products' },
      { to: '/shop?collection=bestsellers', label: 'Best sellers' },
      { to: '/membership', label: 'Membership' },
      { to: '/institutional', label: 'Institutional solutions' },
    ],
  },
  {
    title: 'Care & Knowledge',
    links: [
      { to: '/wellness', label: 'The Wellness Hub' },
      { to: '/manual', label: 'Digital Manual' },
      { to: '/consultation', label: 'Consultation' },
      { to: '/spiritual-guidance', label: 'Spiritual guidance (CoP)' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/contact', label: 'Contact' },
      { to: '/contact', label: 'Careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/contact', label: 'Help center' },
      { to: '/contact', label: 'Shipping' },
      { to: '/contact', label: 'Returns' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-50/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="inline-flex max-w-[260px] rounded-md border border-slate-200/90 bg-white p-2.5 shadow-sm"
            >
              <img
                src={LOGO_SRC}
                alt=""
                width={240}
                height={80}
                className="h-14 w-auto object-contain object-left"
              />
              <span className="sr-only">{COMPANY_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Physician-informed wellness, emergency preparedness, and premium supplements from{' '}
              {COMPANY_NAME}.
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-slate-600 transition hover:text-brand-700"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border border-slate-200 bg-white p-6 text-left text-xs leading-relaxed text-slate-500">
          <strong className="text-slate-700">Disclaimer:</strong> Information on this demo site is for
          illustration only and is not medical advice. Consult a licensed healthcare professional for
          diagnosis and treatment. Products shown are fictional placeholders.
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="transition-colors duration-300 ease-out hover:text-brand-700">
              Privacy
            </Link>
            <Link to="/contact" className="transition-colors duration-300 ease-out hover:text-brand-700">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
