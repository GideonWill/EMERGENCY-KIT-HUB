import { Link } from 'react-router-dom'

/** Trending product cards — fixed square image area for consistent layout */
export default function TrendingSpotlightTile({ product }) {
  const { id, name, price, image, rating, reviews } = product

  return (
    <Link
      to={`/product/${id}`}
      className="group flex w-44 shrink-0 snap-start flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="h-44 w-44 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col border-t border-slate-200 p-3">
        <p className="line-clamp-2 font-display text-sm leading-snug text-slate-900">{name}</p>
        <p className="mt-1 text-xs text-amber-600">
          ★ {rating}{' '}
          <span className="text-slate-400">({reviews.toLocaleString()} reviews)</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900">${price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
