import crypto from 'crypto'
import { validationResult } from 'express-validator'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Payment from '../models/Payment.js'
import Subscription from '../models/Subscription.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  const { items, shippingSnapshot } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'items[] required' })
  }

  const paystackKey = process.env.PAYSTACK_SECRET_KEY
  if (!paystackKey) {
    return res.status(503).json({ success: false, message: 'Paystack is not configured — set PAYSTACK_SECRET_KEY in .env' })
  }

  const isMembership = req.body.flow === 'membership'
  const orderItems = []
  let totalCents = 0

  if (isMembership) {
    const planId = items[0].productId
    const planNames = { essential: 'Essential Plan', care_plus: 'Care Plus Plan', family: 'Family Plan' }
    const planPrices = { essential: 2900, care_plus: 7900, family: 12900 }
    
    const price = planPrices[planId] || 2900
    const name = planNames[planId] || 'Membership Plan'
    
    totalCents = price
    orderItems.push({
      productId: 0, // Placeholder for membership
      name: name,
      unitPriceCents: price,
      quantity: 1,
      image: null,
    })
  } else {
    const productIds = [...new Set(items.map((i) => Number(i.productId)))]
    const products = await Product.findByIds(productIds)
    if (products.length !== productIds.length) {
      return res.status(400).json({ success: false, message: 'One or more products are invalid or inactive' })
    }

    for (const line of items) {
      const p = products.find((x) => x._id === Number(line.productId))
      if (!p) continue
      
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
    }
  }

  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    totalCents,
    status: 'pending',
    shippingSnapshot: shippingSnapshot || {},
  })

  // Initialize Paystack Transaction
  // Paystack amount is in kobo/pesewas (cents)
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${paystackKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: req.user.email,
      amount: totalCents,
      currency: 'GHS',
      first_name: req.user.firstName,
      last_name: req.user.lastName,
      phone: req.user.phone,
      callback_url: `${req.headers.origin || 'http://localhost:5173'}/checkout/success?method=paystack&orderId=${order._id}`,
      metadata: {
        orderId: String(order._id),
        userId: String(req.user._id),
        custom_fields: [
          {
            display_name: "Products",
            variable_name: "products",
            value: orderItems.map(item => `${item.name} (x${item.quantity})`).join(', ')
          }
        ]
      },
    }),
  })

  const data = await response.json()

  if (!data.status) {
    return res.status(400).json({ success: false, message: data.message || 'Paystack initialization failed' })
  }

  await Order.updatePaystackReference(order._id, data.data.reference)

  res.json({
    success: true,
    data: {
      url: data.data.authorization_url,
      reference: data.data.reference,
      orderId: order._id,
    },
  })
})

/**
 * Paystack Webhook Handler (Production Ready)
 * 
 * SECURITY AUDIT:
 * - Signature Verification: Uses HMAC-SHA512 to ensure data integrity.
 * - Idempotency: Checks database for existing Paystack references before processing.
 * - Error Handling: Captures failures without exposing internal logic.
 */
export async function handlePaystackWebhook(req, res) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    console.error('FATAL: PAYSTACK_SECRET_KEY not set during webhook event')
    return res.status(500).json({ error: 'Internal configuration error' })
  }

  // 1. Signature Verification
  // Paystack sends a signature in the header: x-paystack-signature
  const signature = req.headers['x-paystack-signature']
  
  // Since we use express.raw({ type: 'application/json' }) in index.js,
  // req.body is a Buffer. We use it directly for HMAC.
  const hash = crypto
    .createHmac('sha512', secret)
    .update(req.body) 
    .digest('hex')
  
  if (hash !== signature) {
    console.warn('SECURITY ALERT: Invalid Paystack signature received')
    return res.status(401).send('Invalid signature')
  }

  // Parse the body after verification
  let event
  try {
    event = JSON.parse(req.body.toString())
  } catch (err) {
    console.error('Webhook Parse Error:', err)
    return res.status(400).send('Invalid JSON')
  }
  console.log(`Paystack Webhook Received: ${event.event}`)

  try {
    // 2. Handle successful charge
    if (event.event === 'charge.success') {
      const { reference, metadata, amount, currency, customer } = event.data
      const orderId = metadata?.orderId

      // Idempotency check: Has this reference already been processed?
      const existingPayment = await Payment.findByReference(reference)
      if (existingPayment) {
        console.log(`Webhook Ignored: Reference ${reference} already processed`)
        return res.json({ received: true, message: 'already_processed' })
      }

      if (orderId) {
        const order = await Order.findById(Number(orderId))
        
        if (order) {
          // Update Order Status
          if (order.status === 'pending') {
            await Order.updateStatus(order._id, 'paid')
          }

          // Log Transaction
          await Payment.create({
            userId: order.user,
            orderId: order._id,
            paystackReference: reference,
            amountCents: amount,
            currency: currency || 'GHS',
            status: 'succeeded',
            metadata: { 
              paystackEventId: event.id,
              customerEmail: customer.email,
              ipAddress: req.ip
            },
          })
          
          console.log(`Order ${orderId} marked as PAID via Paystack Reference ${reference}`)
        }
      }
    }

    // 3. Handle failed charge (Optional but recommended for analytics)
    if (event.event === 'charge.failed') {
       const { reference, metadata } = event.data
       console.log(`Payment FAILED for Reference: ${reference}`)
       // Logic to notify customer or update order status to 'failed'
    }

  } catch (e) {
    console.error('Paystack Webhook Handler Processing Error:', e)
    // We return 500 so Paystack retries the webhook later
    return res.status(500).json({ received: false })
  }

  // Return 200 to acknowledge receipt
  res.json({ received: true })
}
