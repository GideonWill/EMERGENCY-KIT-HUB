import { Link } from 'react-router-dom'
import { CTA_PRIMARY } from '../config/brand'

export default function ProductCard({ product }) {
  const { id, name, price, tagline, rating, reviews, image, badge } = product

  return (
    <article className="group flex flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/product/${id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        {badge && (
          <span className="absolute left-0 top-0 z-10 bg-brand-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {badge}
          </span>
        )}
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col border-t border-slate-200 p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-amber-600">
          <span aria-hidden>★</span>
          <span className="font-medium text-slate-800">{rating}</span>
          <span className="text-slate-400">({reviews.toLocaleString()} reviews)</span>
        </div>
        <Link to={`/product/${id}`}>
          <h3 className="font-display text-lg text-slate-900 transition group-hover:text-brand-700">
            {name}
          </h3>
        </Link>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{tagline}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-slate-900">GH₵{price.toFixed(2)}</p>
          <Link
            to={`/product/${id}`}
            className={`px-4 py-2 text-sm ${CTA_PRIMARY}`}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
