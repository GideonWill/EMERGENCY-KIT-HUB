import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getGalleryImages, getRelatedProducts, products as initialProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import { COMPANY_NAME, CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import { apiFetch } from '../lib/api'

function ChevronRight({ className }) {
  return (
    <svg className={className} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeIdx, setActiveIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [subscription, setSubscription] = useState('one-time')
  const [addedMsg, setAddedMsg] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        // Fetch specific product and entire catalog for related products
        const [prodRes, catRes] = await Promise.all([
          apiFetch(`/api/products/${id}`),
          apiFetch('/api/products')
        ])
        
        if (prodRes.success && prodRes.data) {
          // Merge with static data for missing UI fields (rating, reviews, highlights)
          const staticMatch = initialProducts.find(p => p.slug === prodRes.data.slug || String(p.id) === String(id))
          setProduct({
            ...staticMatch,
            ...prodRes.data,
            // compute display price from priceCents
            price: prodRes.data.priceCents ? prodRes.data.priceCents / 100 : (staticMatch?.price || 0),
            rating: staticMatch?.rating || 4.9,
            reviews: staticMatch?.reviews || 120,
            tagline: staticMatch?.tagline || 'Premium wellness support.',
            highlights: staticMatch?.highlights || ['High quality ingredients', 'Lab tested', 'Fast shipping']
          })
        }
        
        if (catRes.success && catRes.data) {
          setCatalog(catRes.data.map(p => ({
            ...p,
            price: p.priceCents ? p.priceCents / 100 : 0,
            rating: p.rating || 4.9,
            reviews: p.reviews || 120,
            tagline: p.tagline || 'Premium wellness support.',
          })))
        }
      } catch (err) {
        console.error('Failed to load product details:', err)
        setError('Product not found.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl text-slate-900">Loading...</h1>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl text-slate-900">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-brand-700 underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const { name, price, tagline, rating, reviews, description, highlights, badge, status } = product
  const gallery = getGalleryImages(product)
  const activeImage = gallery[activeIdx] ?? gallery[0]
  const related = catalog.filter(p => p.id !== product.id).slice(0, 4)

  return (
    <div className="bg-white">
      {/* Breadcrumb bar */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-3 text-sm text-slate-500 sm:px-6 lg:px-8">
          <Link to="/" className="transition hover:text-brand-700">
            Home
          </Link>
          <ChevronRight className="text-slate-300" />
          <Link to="/shop" className="transition hover:text-brand-700">
            Shop
          </Link>
          <ChevronRight className="text-slate-300" />
          <span className="line-clamp-1 font-medium text-slate-800">{name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[1.05fr_1fr] xl:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden border border-slate-200 bg-white p-8">
              {badge && (
                <span className="absolute left-0 top-0 z-10 bg-brand-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {badge}
                </span>
              )}
              {status && status !== 'In Stock' && (
                <span className={`absolute right-0 top-0 z-10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm ${
                  status === 'Out of Stock' ? 'bg-red-600' : 'bg-amber-600'
                }`}>
                  {status}
                </span>
              )}
              <img src={activeImage} alt="" className={`aspect-square w-full object-contain ${status === 'Out of Stock' ? 'opacity-40 grayscale' : ''}`} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden border-2 transition sm:h-20 sm:w-20 ${
                    activeIdx === i ? 'border-brand-600 ring-1 ring-brand-600' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Buy box — sticky on large screens */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{COMPANY_NAME}</p>
            <h1 className="mt-2 font-display text-3xl leading-tight text-slate-900 sm:text-4xl">{name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-amber-600" aria-hidden>
                ★
              </span>
              <span className="font-semibold text-slate-800">{rating} / 5</span>
              <a
                href="#reviews"
                className="text-slate-500 underline-offset-2 transition-colors duration-300 ease-out hover:text-brand-700 hover:underline"
              >
                {reviews.toLocaleString()} reviews
              </a>
            </div>

            <p className="mt-2 text-lg text-brand-800">{tagline}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 border-b border-slate-200 pb-6">
              <span className="text-3xl font-semibold tracking-tight text-slate-900">GH₵{price.toFixed(2)}</span>
              <span className="text-sm text-slate-500">GHS</span>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              {highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-brand-600" aria-hidden>
                    ✓
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-slate-200 bg-slate-200 text-center text-[11px] font-medium uppercase tracking-wide text-slate-600 sm:text-xs">
              <div className="bg-slate-50/90 py-4">
                <p className="text-slate-900">Secure checkout</p>
                <p className="mt-1 font-normal normal-case text-slate-500">Encrypted</p>
              </div>
              <div className="bg-slate-50/90 py-4">
                <p className="text-slate-900">Support</p>
                <p className="mt-1 font-normal normal-case text-slate-500">Mon–Fri</p>
              </div>
            </div>

            {/* Subscription Logic */}
            <div className="mt-8 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Purchase options</label>
              <div 
                className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                  subscription === 'one-time' ? 'border-brand-600 bg-brand-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSubscription('one-time')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${subscription === 'one-time' ? 'border-brand-600' : 'border-slate-300'}`}>
                    {subscription === 'one-time' && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                  </div>
                  <span className="text-sm font-medium text-slate-900">One-time purchase</span>
                </div>
                <span className="text-sm font-bold text-slate-900">GH₵{price.toFixed(2)}</span>
              </div>

              <div 
                className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                  subscription === 'refill' ? 'border-brand-600 bg-brand-50/30' : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSubscription('refill')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${subscription === 'refill' ? 'border-brand-600' : 'border-slate-300'}`}>
                    {subscription === 'refill' && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-900">Subscribe & Save (Refill Plan)</span>
                    <span className="block text-[10px] text-brand-700 font-bold uppercase">Automated Restocking</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-brand-800">GH₵{(price * 0.9).toFixed(2)}</span>
                  <span className="block text-[10px] text-slate-400 line-through">GH₵{price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl">📖</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Digital Manual Included</p>
                  <p className="text-xs text-slate-500 mt-0.5">Instant access to first-aid guides after purchase.</p>
                  <Link to="/manual" className="mt-2 inline-block text-xs font-bold text-brand-700 hover:underline">Preview manual →</Link>
                </div>
              </div>
            </div>

            {addedMsg && (
              <p className="mt-4 border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-900" role="status">
                {addedMsg}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div>
                <label htmlFor="qty" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Quantity
                </label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-center text-base font-medium text-slate-900 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 sm:w-24"
                />
              </div>
              <button
                type="button"
                disabled={status === 'Out of Stock'}
                onClick={() => {
                  if (status === 'Out of Stock') return
                  const finalPrice = subscription === 'refill' ? product.price * 0.9 : product.price
                  const displayName = subscription === 'refill' ? `${product.name} (Refill Subscription)` : product.name
                  
                  addItem(
                    {
                      id: product.id,
                      name: displayName,
                      price: finalPrice,
                      image: product.image,
                    },
                    qty
                  )
                  setAddedMsg(`Added ${qty} × ${displayName} to your cart.`)
                  setQty(1)
                }}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide ${status === 'Out of Stock' ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : CTA_PRIMARY}`}
              >
                {status === 'Out of Stock' ? 'Out of Stock' : 'Add to cart'}
              </button>
            </div>

            <Link
              to="/membership"
              className={`mt-3 flex w-full items-center justify-center py-3.5 text-sm ${CTA_SECONDARY}`}
            >
              Buy with care plan
            </Link>

            <Link
              to="/contact"
              className="mt-4 block text-center text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
            >
              Ask a specialist
            </Link>

            <p className="mt-6 text-xs leading-relaxed text-slate-500">
              Demo only — no checkout. Consult a licensed healthcare professional before using any
              medication or supplement.
            </p>

            {/* Accordions */}
            <div className="mt-10 space-y-0 border-t border-slate-200">
              <details className="group border-b border-slate-200" open>
                <summary className="cursor-pointer list-none py-4 pr-8 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between">
                    Description
                    <span className="text-slate-400 transition group-open:rotate-180">▼</span>
                  </span>
                </summary>
                <div className="pb-4 text-sm leading-relaxed text-slate-600">{description}</div>
              </details>
              <details className="group border-b border-slate-200">
                <summary className="cursor-pointer list-none py-4 pr-8 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between">
                    How to use
                    <span className="text-slate-400 transition group-open:rotate-180">▼</span>
                  </span>
                </summary>
                <div className="pb-4 text-sm leading-relaxed text-slate-600">
                  Follow the printed guide included with your order. Placeholder instructions for UI
                  demonstration — replace with FDA-compliant copy where required.
                </div>
              </details>
              <details className="group border-b border-slate-200">
                <summary className="cursor-pointer list-none py-4 pr-8 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between">
                    Shipping &amp; returns
                    <span className="text-slate-400 transition group-open:rotate-180">▼</span>
                  </span>
                </summary>
                <div className="pb-4 text-sm leading-relaxed text-slate-600">
                  Standard delivery 3–7 business days. Returns accepted on unopened items within 30 days
                  (demo policy).
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Reviews anchor + placeholder */}
        <section id="reviews" className="mt-16 border-t border-slate-200 pt-12 scroll-mt-28">
          <h2 className="font-display text-2xl text-slate-900">Customer reviews</h2>
          <p className="mt-2 text-sm text-slate-600">
            Average {rating} out of 5 · {reviews.toLocaleString()} reviews (placeholder).
          </p>
          <div className="mt-8 border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Review list and filters would load here in a production store.
          </div>
        </section>

        {/* Related products */}
        <section className="mt-16 border-t border-slate-200 pt-12">
          <h2 className="font-display text-2xl text-slate-900 sm:text-3xl">You may also like</h2>
          <p className="mt-2 text-slate-600">Customers who viewed this item also viewed</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
