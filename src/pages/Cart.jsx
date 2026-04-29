import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
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

  async function processCheckout() {
    setMsg('')
    if (!lines.length) return
    if (!isAuthenticated) {
      setMsg('Sign in or create an account using the panel above.')
      return
    }

    setBusy(true)
    try {
      // 1) Verify products against the backend
      const itemsPayload = []
      const catalog = await apiFetch('/api/products').catch(() => null)
      if (catalog && catalog.data) {
        const bySlug = new Map(catalog.data.map((p) => [p.slug, p]))
        const byId = new Map(catalog.data.map((p) => [p.id, p]))

        for (const line of lines) {
          // 1. Try static mapping for initial products
          const mappedSlug = FRONTEND_ID_TO_API_SLUG[line.id]
          let dbProduct = mappedSlug ? bySlug.get(mappedSlug) : null

          // 2. If not found, try direct ID lookup (for new Admin products)
          if (!dbProduct) {
            dbProduct = byId.get(line.id) || byId.get(Number(line.id))
          }

          // 3. Last resort: try direct slug lookup
          if (!dbProduct) {
            dbProduct = bySlug.get(line.id)
          }

          if (dbProduct) {
            itemsPayload.push({
              productId: dbProduct.id,
              quantity: Number(line.quantity)
            })
          } else {
            console.error(`Product not found in database for id/slug: ${line.id}`)
            setMsg(`Product "${line.name}" is currently unavailable for checkout.`)
            setBusy(false)
            return
          }
        }
      } else {
        setMsg('Unable to verify products. Please try again.')
        setBusy(false)
        return
      }

      // 2) Paystack Checkout via backend
      const res = await apiFetch('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          items: itemsPayload,
          shippingSnapshot: { method: 'Paystack' }
        })
      })
      if (res.success && res.data?.url) {
        window.location.href = res.data.url
        return
      }
      setMsg(res.message || 'Payment session could not be created. Please try again.')
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
          <li key={line.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4">
            <div className="flex w-full sm:w-auto items-center gap-4 sm:flex-1">
              {line.image && (
                <img src={line.image} alt="" className="h-20 w-20 shrink-0 border border-slate-200 object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 line-clamp-2">{line.name}</p>
                <p className="mt-1 text-sm text-slate-600">GH₵{line.price.toFixed(2)} each</p>
              </div>
            </div>
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100">
              <div className="flex items-center gap-2">
                <label htmlFor={`qty-${line.id}`} className="sr-only">
                  Quantity
                </label>
                <input
                  id={`qty-${line.id}`}
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => setQuantity(line.id, e.target.value)}
                  className="w-20 border border-slate-300 px-2 py-2 text-center"
                />
              </div>
              <p className="min-w-[4.5rem] text-right font-semibold text-slate-900">
                GH₵{(line.price * line.quantity).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                className="text-sm font-medium text-red-700 underline shrink-0"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <p className="text-lg font-semibold text-slate-900">Total: GH₵{total.toFixed(2)}</p>
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
            onClick={() => void processCheckout()}
            disabled={busy || !isAuthenticated}
            className={`px-8 py-3 text-sm font-bold tracking-wide uppercase ${CTA_PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {busy ? 'Redirecting to payment...' : 'Pay'}
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
