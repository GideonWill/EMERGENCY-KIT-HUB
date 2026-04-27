import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { apiFetch } from '../lib/api'

export default function Shop() {
  const [params] = useSearchParams()
  const collection = params.get('collection')
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const res = await apiFetch('/api/products')
        if (res.success && res.data) {
          setCatalog(res.data.map(p => ({
            ...p,
            price: p.priceCents ? p.priceCents / 100 : 0,
            rating: p.rating || 4.9,
            reviews: p.reviews || 120,
            tagline: p.tagline || 'Premium wellness support.',
          })))
        }
      } catch (err) {
        console.error('Failed to load products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filtered = useMemo(() => {
    if (!collection) return catalog
    if (collection === 'bestsellers') {
      return catalog.filter((p) => p.badge === 'Best Seller')
    }
    if (collection === 'supplements') {
      return catalog.filter((p) => !String(p.sku).includes('KIT'))
    }
    return catalog
  }, [collection, catalog])

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
        {loading ? (
          <div className="py-12 text-center text-slate-600">Loading products...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-12 text-center text-slate-600">No products in this collection.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
