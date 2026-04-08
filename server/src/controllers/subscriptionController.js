import Stripe from 'stripe'
import Subscription from '../models/Subscription.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    const err = new Error('Stripe is not configured — set STRIPE_SECRET_KEY in .env')
    err.status = 503
    throw err
  }
  return new Stripe(key)
}

export const createSubscriptionCheckout = asyncHandler(async (req, res) => {
  const priceId = process.env.STRIPE_PRICE_MEMBERSHIP
  if (!priceId) {
    return res.status(503).json({
      success: false,
      message: 'Set STRIPE_PRICE_MEMBERSHIP in .env to a recurring Price ID from Stripe Dashboard',
    })
  }
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: process.env.STRIPE_SUCCESS_URL || `${process.env.CLIENT_URL}/?subscription=success`,
    cancel_url: process.env.STRIPE_CANCEL_URL || `${process.env.CLIENT_URL}/membership?checkout=cancel`,
    metadata: {
      userId: req.user._id.toString(),
    },
    subscription_data: {
      metadata: { userId: req.user._id.toString() },
    },
  })
  res.json({
    success: true,
    data: { url: session.url, sessionId: session.id },
  })
})

export const listMySubscriptions = asyncHandler(async (req, res) => {
  const subs = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 }).lean()
  res.json({ success: true, data: subs })
})
