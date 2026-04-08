import { Link } from 'react-router-dom'
import { CTA_PRIMARY } from '../config/brand'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">That URL doesn&apos;t exist on this demo site.</p>
      <Link
        to="/"
        className={`mt-8 inline-flex px-8 py-3 text-sm ${CTA_PRIMARY}`}
      >
        Back to home
      </Link>
    </div>
  )
}
