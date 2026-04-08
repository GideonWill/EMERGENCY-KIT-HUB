import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import { useCart } from '../context/CartContext'

/** Shown after Stripe redirects back with a successful payment */
export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const isDemo = searchParams.get('demo') === '1'
  const flowMembership = searchParams.get('flow') === 'membership'
  const { clear } = useCart()

  useEffect(() => {
    clear()
  }, [clear])

  const method = searchParams.get('method') || ''
  
  let paymentText = 'Your payment was submitted securely'
  if (method === 'mobile_money') paymentText = 'Your Mobile Money payment is currently being processed'
  if (method === 'bank_card') paymentText = 'Your Bank Card payment has been approved'

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      {isDemo && (
        <p className="border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-950">
          Simulation only — no payment was processed.
        </p>
      )}
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">
        {flowMembership ? 'Membership' : 'Checkout'}
      </p>
      <h1 className="mt-3 font-display text-3xl text-slate-900">
        {flowMembership ? 'Membership checkout complete (demo)' : 'Thank you for your order'}
      </h1>
      <p className="mt-4 text-slate-600">
        {isDemo
          ? flowMembership
            ? 'In a live deployment, this step would confirm your subscription.'
            : 'In a live deployment, this step would follow payment confirmation.'
          : `${paymentText}. You should receive a confirmation email shortly when the server is fully configured.`}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/shop"
          className={`inline-flex px-8 py-3 text-sm ${CTA_PRIMARY}`}
        >
          Continue shopping
        </Link>
        <Link
          to="/"
          className={`inline-flex px-8 py-3 text-sm ${CTA_SECONDARY}`}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
