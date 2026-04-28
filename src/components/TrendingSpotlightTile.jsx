import { Link } from 'react-router-dom'

/** Trending product cards — fixed square image area for consistent layout */
export default function TrendingSpotlightTile({ product }) {
  const { id, name, image, rating = 4.9, reviews = 120, status } = product
  const price = product.price ?? (product.priceCents ? product.priceCents / 100 : 0)

  return (
    <Link
      to={`/product/${id}`}
      className="group flex w-44 shrink-0 snap-start flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md relative"
    >
      {status && status !== 'In Stock' && (
        <span className={`absolute right-0 top-0 z-10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white ${
          status === 'Out of Stock' ? 'bg-red-600' : 'bg-amber-600'
        }`}>
          {status}
        </span>
      )}
      <div className="h-44 w-44 shrink-0 overflow-hidden bg-white p-3">
        <img
          src={image}
          alt=""
          className={`h-full w-full object-contain transition duration-500 group-hover:scale-105 ${
            status === 'Out of Stock' ? 'opacity-40 grayscale' : ''
          }`}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col border-t border-slate-200 p-3">
        <p className="line-clamp-2 font-display text-sm leading-snug text-slate-900">{name}</p>
        <p className="mt-1 text-xs text-amber-600">
          ★ {rating}{' '}
          <span className="text-slate-400">({reviews.toLocaleString()} reviews)</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900">GH₵{price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
