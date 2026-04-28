import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import { useCart } from '../context/CartContext'
import { apiFetch } from '../lib/api'

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const isDemo = searchParams.get('demo') === '1'
  const flowMembership = searchParams.get('flow') === 'membership'
  const orderId = searchParams.get('orderId')
  const { clear } = useCart()
  const { refreshUser } = useAuth()
  
  const [loading, setLoading] = useState(!isDemo && !!orderId)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    clear()
    refreshUser() // Immediately update user state (premium status, etc)
    
    if (!isDemo && orderId) {
      async function verifyOrder() {
        try {
          const res = await apiFetch(`/api/orders/${orderId}`)
          if (res.success) {
            setOrder(res.data)
          }
        } catch (err) {
          console.error('Error fetching order status:', err)
        } finally {
          setLoading(false)
        }
      }
      verifyOrder()
    }
  }, [clear, isDemo, orderId])

  const method = searchParams.get('method') || ''
  const isPaid = order?.status === 'paid' || order?.status === 'completed'
  
  let paymentText = isPaid ? 'Your payment has been received and confirmed' : 'Your payment was submitted securely'
  if (method === 'mobile_money') paymentText = 'Your Mobile Money payment is currently being processed'
  if (method === 'bank_card') paymentText = 'Your Bank Card payment has been approved'
  if (method === 'paystack') {
    paymentText = isPaid 
      ? 'Your Paystack payment has been received. Thank you for your purchase!' 
      : 'Your Paystack payment has been processed successfully'
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="mb-8 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {isDemo && (
        <p className="mb-6 border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-950">
          Simulation only — no payment was processed.
        </p>
      )}

      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">
        {flowMembership ? 'Membership' : 'Checkout Complete'}
      </p>
      
      <h1 className="mt-3 font-display text-3xl text-slate-900">
        {flowMembership ? 'Membership Activated' : 'Payment Successful'}
      </h1>

      {flowMembership && (
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 border border-amber-200 shadow-sm animate-in zoom-in duration-500">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Premium Care Member
          </span>
        </div>
      )}

      <div className="mt-6 rounded-sm border border-slate-100 bg-slate-50/50 p-6">
        <p className="text-base font-medium text-slate-900">
          {loading ? 'Verifying payment status...' : paymentText}
        </p>
        {!loading && order && (
          <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <p>Order ID: <span className="font-mono font-bold text-slate-900">#{order.id}</span></p>
            <p className="mt-1">Status: <span className="font-bold uppercase text-brand-700">{order.status}</span></p>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-slate-600">
        You should receive a confirmation email shortly. Your items will be prepared for dispatch immediately.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {!flowMembership && (
          <Link
            to="/tracking"
            className={`inline-flex px-8 py-3 text-sm ${CTA_PRIMARY}`}
          >
            Track your order
          </Link>
        )}
        <Link
          to="/shop"
          className={`inline-flex px-8 py-3 text-sm ${flowMembership ? CTA_PRIMARY : CTA_SECONDARY}`}
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
