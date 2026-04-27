import { query } from '../config/db.js'

const Subscription = {
  async findByUser(userId) {
    const { rows } = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return rows.map(Subscription._format)
  },

  async upsertByStripeId({ userId, planName, stripeSubscriptionId, stripePriceId, status, currentPeriodEnd }) {
    const { rows } = await query(
      `INSERT INTO subscriptions (user_id, plan_name, stripe_subscription_id, stripe_price_id, status, current_period_end)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL
       DO UPDATE SET
         user_id = EXCLUDED.user_id,
         plan_name = EXCLUDED.plan_name,
         stripe_price_id = EXCLUDED.stripe_price_id,
         status = EXCLUDED.status,
         current_period_end = EXCLUDED.current_period_end,
         updated_at = now()
       RETURNING *`,
      [userId, planName, stripeSubscriptionId, stripePriceId || null, status, currentPeriodEnd || null]
    )
    return rows[0] ? Subscription._format(rows[0]) : null
  },

  _format(row) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      user: row.user_id,
      planName: row.plan_name,
      status: row.status,
      stripeSubscriptionId: row.stripe_subscription_id,
      stripePriceId: row.stripe_price_id,
      currentPeriodEnd: row.current_period_end,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },
}

export default Subscription
