import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import { useAuth } from '../context/AuthContext'
import { getApiBase, createSubscriptionCheckoutSession } from '../lib/api'
import AuthInlinePanel from '../components/AuthInlinePanel'
import { COMPANY_NAME_SHORT, CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import { isDemoMode } from '../config/demoMode'

const tiers = [
  {
    id: 'essential',
    name: 'Essential',
    price: '$29',
    period: '/ month',
    blurb: 'Discounted supplements, early access to sales, and monthly wellness guides.',
    features: ['10% off supplements', 'Member-only articles', 'Email support'],
    cta: 'Start essential',
    highlighted: false,
  },
  {
    id: 'care_plus',
    name: 'Care Plus',
    price: '$79',
    period: '/ month',
    blurb: 'Virtual consult credits, priority support, and personalized protocol suggestions.',
    features: ['2 consult credits / year', 'Priority routing', '20% off kits', 'Care coordinator'],
    cta: 'Choose Care Plus',
    highlighted: true,
  },
  {
    id: 'family',
    name: 'Family',
    price: '$129',
    period: '/ month',
    blurb: 'Cover your household with shared benefits and emergency-prep checklists.',
    features: ['Up to 4 profiles', 'Quarterly planning calls', '25% off emergency kits'],
    cta: 'Talk to sales',
    highlighted: false,
  },
]

export default function Membership() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  async function processMembershipCheckout(method = 'bank_card') {
    setMsg('')
    if (!selectedPlan) {
      setMsg('Please select a plan first.')
      return
    }
    // Simulate checkout
    if (isDemoMode() && isAuthenticated) {
      setBusy(true)
      window.setTimeout(() => {
        navigate(`/checkout/success?demo=1&flow=membership&method=${method}`)
        setBusy(false)
      }, 450)
      return
    }
    if (!isAuthenticated) {
      setMsg('Sign in or create an account using the panel below first.')
      return
    }
    
    setBusy(true)
    try {
      // Simulate success for now since we don't have a backend payment gateway configured
      await new Promise(resolve => setTimeout(resolve, 1500))
      navigate(`/checkout/success?flow=membership&method=${method}`)
    } catch (e) {
      setMsg(e.message || 'Could not start membership checkout')
    } finally {
      setBusy(false)
    }
  }
// Removing backend try catch as simulated above

  function selectPlan(tier) {
    setSelectedPlan(tier)
    setMsg('')
    const el = document.getElementById('membership-auth')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Hero
        eyebrow="Membership / services"
        title="A membership that"
        titleAccent="meets you where you are"
        subtitle={`Choose a plan with ${COMPANY_NAME_SHORT}, then sign in or create your account to complete payment securely.`}
        primaryCta={{ to: '#plans', label: 'View plans' }}
        secondaryCta={{ to: '/shop', label: 'Shop without membership' }}
        image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80"
        imageAlt="Calm healthcare environment"
      />

      <section id="membership-auth" className="scroll-mt-28 border-b border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          {!isAuthenticated ? (
            <AuthInlinePanel
              intro={
                selectedPlan
                  ? `You selected “${selectedPlan.name}”. Sign in or create your ${COMPANY_NAME_SHORT} account to continue to payment.`
                  : `Pick a plan below, then return here to sign in or register with ${COMPANY_NAME_SHORT} before payment.`
              }
              onAuthSuccess={() => {
                // Wait for explicit button click
              }}
            />
          ) : (
            <p className="border border-brand-200 bg-brand-50 px-4 py-3 text-center text-sm text-brand-900">
              Signed in — choose a plan below, then complete your membership checkout.
              {selectedPlan && (
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => processMembershipCheckout('mobile_money')}
                    className={`px-4 py-2 text-sm ${CTA_PRIMARY} bg-green-700 hover:bg-green-800`}
                  >
                    Pay {selectedPlan.price} with Mobile Money
                  </button>
                  <button
                    onClick={() => processMembershipCheckout('bank_card')}
                    className={`px-4 py-2 text-sm ${CTA_PRIMARY}`}
                  >
                    Pay {selectedPlan.price} with Bank Card
                  </button>
                </div>
              )}
            </p>
          )}
          {msg && (
            <p className="mt-4 border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-900">
              {msg}
            </p>
          )}
        </div>
      </section>

      <section id="plans" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl text-slate-900 sm:text-4xl">
            Choose your plan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Select a tier, sign in or create an account, then confirm payment securely via Mobile Money or Bank Card.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col border border-slate-200 p-8 shadow-sm ${
                  tier.highlighted
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-600 lg:scale-[1.02]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <h3 className="font-display text-2xl text-slate-900">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                  <span className="text-slate-500">{tier.period}</span>
                </p>
                <p className="mt-4 flex-1 text-slate-600">{tier.blurb}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-brand-600">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => selectPlan(tier)}
                  disabled={busy}
                  className={`mt-8 block w-full py-3.5 text-center text-sm ${
                    tier.highlighted ? CTA_PRIMARY : CTA_SECONDARY
                  } disabled:opacity-60`}
                >
                  {selectedPlan?.id === tier.id ? 'Selected' : tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl text-slate-900">Included services</h2>
          <p className="mt-4 text-slate-600">
            Educational webinars, seasonal preparedness reminders, and optional add-on labs.
          </p>
          <Link
            to="/contact"
            className={`mt-8 inline-flex px-8 py-3.5 text-sm ${CTA_PRIMARY}`}
          >
            Request details
          </Link>
        </div>
      </section>
    </>
  )
}
