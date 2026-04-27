import { query } from '../config/db.js'

const Payment = {
  async create({ userId, orderId, paystackReference, stripeSessionId, stripePaymentIntentId, amountCents, currency = 'usd', status = 'pending', metadata }) {
    const { rows } = await query(
      `INSERT INTO payments (user_id, order_id, paystack_reference, stripe_session_id, stripe_payment_intent_id, amount_cents, currency, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, orderId || null, paystackReference || null, stripeSessionId || null, stripePaymentIntentId || null, amountCents, currency, status, metadata ? JSON.stringify(metadata) : null]
    )
    return Payment._format(rows[0])
  },

  async findByReference(reference) {
    const { rows } = await query(
      'SELECT * FROM payments WHERE paystack_reference = $1',
      [reference]
    )
    return Payment._format(rows[0])
  },

  async findByUser(userId) {
    const { rows } = await query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return rows.map(Payment._format)
  },

  _format(row) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      user: row.user_id,
      order: row.order_id,
      paystackReference: row.paystack_reference,
      stripeSessionId: row.stripe_session_id,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      amountCents: row.amount_cents,
      currency: row.currency,
      status: row.status,
      metadata: row.metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },
}

export default Payment
