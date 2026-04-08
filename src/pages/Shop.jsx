import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

export default function Shop() {
  const [params] = useSearchParams()
  const collection = params.get('collection')

  const filtered = useMemo(() => {
    if (!collection) return products
    if (collection === 'bestsellers') {
      return products.filter((p) => p.badge === 'Best Seller')
    }
    if (collection === 'supplements') {
      return products.filter((p) => !p.id.includes('emergency') && !p.id.includes('kit'))
    }
    return products
  }, [collection])

  const title =
    collection === 'bestsellers'
      ? 'Best sellers'
      : collection === 'supplements'
        ? 'Supplements'
        : 'All products'

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Shop</p>
          <h1 className="mt-2 font-display text-4xl text-slate-900">{title}</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Placeholder catalog grid — responsive columns match a modern wellness storefront.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-slate-600">No products in this collection.</p>
        )}
      </div>
    </div>
  )
}
