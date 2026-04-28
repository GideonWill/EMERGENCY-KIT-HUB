import { Link } from 'react-router-dom'
import { COMPANY_NAME } from '../config/brand'

export default function AnnouncementBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 bg-brand-900 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.12em] text-brand-100 sm:text-sm">
      <span className="text-white/95">{COMPANY_NAME}</span>
      <span className="hidden text-brand-600 sm:inline" aria-hidden>
        ·
      </span>
      <span className="text-brand-100/90">Preparedness &amp; wellness</span>
      <Link
        to="/shop"
        className="inline-flex border border-amber-400 bg-amber-400 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-950 shadow-sm transition hover:border-amber-300 hover:bg-amber-300 sm:text-xs"
      >
        Shop catalog
      </Link>
    </div>
  )
}
