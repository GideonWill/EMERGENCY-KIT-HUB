import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiFetch, getApiBase } from '../lib/api'
import { FRONTEND_ID_TO_API_SLUG } from '../data/productApiSlugMap'
import AuthInlinePanel from '../components/AuthInlinePanel'
import { COMPANY_NAME_SHORT, CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import { isDemoMode } from '../config/demoMode'

export default function Cart() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const checkoutCancelled = searchParams.get('checkout') === 'cancel'
  const { lines, setQuantity, removeLine, total, clear } = useCart()
  const { isAuthenticated } = useAuth()
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState('bank_card') // 'bank_card' or 'mobile_money'

  async function processCheckout(method) {
    setMsg('')
    if (!lines.length) return
    if (!isAuthenticated) {
      setMsg('Sign in or create an account using the panel above.')
      return
    }

    setBusy(true)
    try {
      // Simulate checking products against the backend
      if (getApiBase()) {
        const catalog = await apiFetch('/api/products').catch(() => null)
        if (catalog && catalog.data) {
          const bySlug = new Map(catalog.data.map((p) => [p.slug, p]))
          for (const line of lines) {
            const slug = FRONTEND_ID_TO_API_SLUG[line.id]
            if (slug && !bySlug.has(slug)) {
              setMsg(`Product slug "${slug}" not found in API. Run npm run seed.`)
              setBusy(false)
              return
            }
          }
        }
      }

      // Simulate payment processing working correctly for 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Complete order
      clear()
      navigate(`/checkout/success?method=${method}`)
    } catch (e) {
      setMsg(e.message || 'Checkout failed')
    } finally {
      setBusy(false)
    }
  }

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl text-slate-900">Your cart is empty</h1>
        <Link
          to="/shop"
          className={`mt-8 inline-flex px-8 py-3 text-sm ${CTA_PRIMARY}`}
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-slate-900">Cart</h1>
      <p className="mt-2 text-sm text-slate-600">
        Checkout with Mobile Money or Bank Card is available after you sign in to {COMPANY_NAME_SHORT}.
      </p>

      {checkoutCancelled && (
        <p className="mt-4 border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-800" role="status">
          Checkout was cancelled. Your cart is unchanged — you can try again when ready.
        </p>
      )}
      {msg && (
        <p className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          {msg}
        </p>
      )}

      {!isAuthenticated && (
        <div className="mt-8">
          <AuthInlinePanel
            intro="New here? Create an account. Returning customer? Sign in — then continue to secure checkout."
            onAuthSuccess={() => {
              // Wait for user before proceeding
            }}
          />
        </div>
      )}

      <ul className="mt-8 divide-y divide-slate-200 border border-slate-200">
        {lines.map((line) => (
          <li key={line.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
            {line.image && (
              <img src={line.image} alt="" className="h-20 w-20 border border-slate-200 object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{line.name}</p>
              <p className="text-sm text-slate-600">${line.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`qty-${line.id}`} className="sr-only">
                Quantity
              </label>
              <input
                id={`qty-${line.id}`}
                type="number"
                min={1}
                max={99}
                value={line.quantity}
                onChange={(e) => setQuantity(line.id, e.target.value)}
                className="w-16 border border-slate-300 px-2 py-2 text-center"
              />
            </div>
            <p className="w-24 text-right font-semibold text-slate-900">
              ${(line.price * line.quantity).toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => removeLine(line.id)}
              className="text-sm text-red-700 underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <p className="text-lg font-semibold text-slate-900">Total: ${total.toFixed(2)}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => clear()}
            className={`px-5 py-2.5 text-sm ${CTA_SECONDARY}`}
          >
            Clear cart
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => void processCheckout('mobile_money')}
            disabled={busy || !isAuthenticated}
            className={`px-6 py-2.5 text-sm ${CTA_PRIMARY} bg-green-700 hover:bg-green-800 focus:ring-green-700 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {busy ? 'Processing…' : 'Pay with Mobile Money'}
          </button>
          <button
            type="button"
            onClick={() => void processCheckout('bank_card')}
            disabled={busy || !isAuthenticated}
            className={`px-6 py-2.5 text-sm ${CTA_PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {busy ? 'Processing…' : 'Pay with Bank Card'}
          </button>
        </div>
      </div>
      {!isAuthenticated && (
        <p className="mt-4 text-xs text-slate-500">
          The checkout button activates after you sign in or register above.
        </p>
      )}
    </div>
  )
}
