import Stripe from 'stripe'
import { validationResult } from 'express-validator'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Payment from '../models/Payment.js'
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

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const { items, shippingSnapshot } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'items[] required' })
  }

  const stripe = getStripe()
  const productIds = [...new Set(items.map((i) => i.productId))]
  const products = await Product.find({ _id: { $in: productIds }, active: true })
  if (products.length !== productIds.length) {
    return res.status(400).json({ success: false, message: 'One or more products are invalid or inactive' })
  }

  const lineItems = []
  const orderItems = []
  let totalCents = 0

  for (const line of items) {
    const p = products.find((x) => x._id.toString() === line.productId)
    const qty = Math.min(99, Math.max(1, parseInt(line.quantity, 10) || 1))
    const subtotal = p.priceCents * qty
    totalCents += subtotal
    orderItems.push({
      productId: p._id,
      name: p.name,
      unitPriceCents: p.priceCents,
      quantity: qty,
      image: p.image,
    })
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: p.name,
          ...(p.image ? { images: [p.image] } : {}),
        },
        unit_amount: p.priceCents,
      },
      quantity: qty,
    })
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalCents,
    status: 'pending',
    shippingSnapshot: shippingSnapshot || {},
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url:
      process.env.STRIPE_SUCCESS_URL ||
      `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success`,
    cancel_url:
      process.env.STRIPE_CANCEL_URL ||
      `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart?checkout=cancel`,
    client_reference_id: order._id.toString(),
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
  })

  order.stripeCheckoutSessionId = session.id
  await order.save()

  res.json({
    success: true,
    data: {
      url: session.url,
      sessionId: session.id,
      orderId: order._id,
    },
  })
})

/**
 * Raw body only — mounted before express.json in index.js
 */
export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature']
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).send('Stripe webhook not configured')
  }
  const stripe = getStripe()
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      if (session.mode === 'payment') {
        const orderId = session.metadata?.orderId
        if (orderId) {
          const order = await Order.findById(orderId)
          if (order && order.status === 'pending') {
            order.status = 'paid'
            await order.save()
            await Payment.create({
              user: order.user,
              order: order._id,
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent || undefined,
              amountCents: session.amount_total || order.totalCents,
              currency: session.currency || 'usd',
              status: 'succeeded',
              metadata: { stripeEventId: event.id },
            })
          }
        }
      }

      if (session.mode === 'subscription') {
        const userId = session.metadata?.userId
        const subId = session.subscription
        if (userId && subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const priceId = sub.items?.data?.[0]?.price?.id
          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subId },
            {
              user: userId,
              planName: 'Membership',
              stripeSubscriptionId: subId,
              stripePriceId: priceId,
              status: sub.status === 'active' ? 'active' : 'incomplete',
              currentPeriodEnd: sub.current_period_end
                ? new Date(sub.current_period_end * 1000)
                : undefined,
            },
            { upsert: true, new: true }
          )
        }
      }
    }
  } catch (e) {
    console.error('Webhook handler error', e)
    return res.status(500).json({ received: false })
  }

  res.json({ received: true })
}
