import { query, getPool } from '../config/db.js'

const Order = {
  async create({ userId, items, totalCents, status = 'pending', shippingSnapshot = {} }) {
    const client = await getPool().connect()
    try {
      await client.query('BEGIN')

      const { rows } = await client.query(
        `INSERT INTO orders (user_id, total_cents, status,
           shipping_line1, shipping_city, shipping_state, shipping_postal_code, shipping_country)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          userId, totalCents, status,
          shippingSnapshot.line1 || null,
          shippingSnapshot.city || null,
          shippingSnapshot.state || null,
          shippingSnapshot.postalCode || null,
          shippingSnapshot.country || 'US',
        ]
      )
      const order = rows[0]

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, unit_price_cents, quantity, image)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [order.id, item.productId, item.name, item.unitPriceCents, item.quantity, item.image || null]
        )
      }

      await client.query('COMMIT')
      return Order._format(order, items)
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM orders WHERE id = $1', [id])
    if (!rows[0]) return null
    const items = await Order._getItems(id)
    return Order._format(rows[0], items)
  },

  async updateStatus(id, status) {
    const { rows } = await query(
      'UPDATE orders SET status = $2, updated_at = now() WHERE id = $1 RETURNING *',
      [id, status]
    )
    if (!rows[0]) return null
    const items = await Order._getItems(id)
    return Order._format(rows[0], items)
  },

  async updatePaystackReference(id, reference) {
    await query(
      'UPDATE orders SET paystack_reference = $2, updated_at = now() WHERE id = $1',
      [id, reference]
    )
  },

  async findByUser(userId) {
    const { rows } = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    const orders = []
    for (const row of rows) {
      const items = await Order._getItems(row.id)
      orders.push(Order._format(row, items))
    }
    return orders
  },

  async findAllWithUser() {
    const { rows } = await query(
      `SELECT o.*, u.email, u.first_name, u.last_name
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    )
    const orders = []
    for (const row of rows) {
      const items = await Order._getItems(row.id)
      const formatted = Order._format(row, items)
      formatted.user = {
        _id: row.user_id,
        email: row.email,
        profile: { firstName: row.first_name, lastName: row.last_name },
      }
      orders.push(formatted)
    }
    return orders
  },

  async _getItems(orderId) {
    const { rows } = await query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    )
    return rows.map((r) => ({
      productId: r.product_id,
      name: r.name,
      unitPriceCents: r.unit_price_cents,
      quantity: r.quantity,
      image: r.image,
    }))
  },

  _format(row, items = []) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      user: row.user_id,
      items,
      totalCents: row.total_cents,
      status: row.status,
      stripeCheckoutSessionId: row.stripe_checkout_session_id,
      paystackReference: row.paystack_reference,
      shippingSnapshot: {
        line1: row.shipping_line1,
        city: row.shipping_city,
        state: row.shipping_state,
        postalCode: row.shipping_postal_code,
        country: row.shipping_country,
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },
}

export default Order
