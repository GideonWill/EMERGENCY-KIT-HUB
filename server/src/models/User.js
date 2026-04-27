import { query } from '../config/db.js'

const User = {
  async findByEmail(email) {
    const { rows } = await query(
      'SELECT id, email, role, first_name, last_name, phone, health_placeholder, stripe_customer_id, created_at, updated_at FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )
    return rows[0] ? User._format(rows[0]) : null
  },

  async findByEmailWithPassword(email) {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )
    return rows[0] ? User._formatFull(rows[0]) : null
  },

  async findById(id) {
    const { rows } = await query(
      'SELECT id, email, role, first_name, last_name, phone, health_placeholder, stripe_customer_id, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )
    return rows[0] ? User._format(rows[0]) : null
  },

  async create({ email, passwordHash, firstName, lastName, phone, role = 'user' }) {
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [email, passwordHash, role, firstName, lastName, phone]
    )
    return User._format(rows[0])
  },

  async updateProfile(id, { firstName, lastName, phone, healthPlaceholder }) {
    const { rows } = await query(
      `UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name  = COALESCE($3, last_name),
           phone      = COALESCE($4, phone),
           health_placeholder = COALESCE($5, health_placeholder),
           updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, firstName, lastName, phone, healthPlaceholder]
    )
    return rows[0] ? User._format(rows[0]) : null
  },

  async updateStripeCustomerId(id, stripeCustomerId) {
    await query(
      'UPDATE users SET stripe_customer_id = $2, updated_at = now() WHERE id = $1',
      [id, stripeCustomerId]
    )
  },

  /** Map snake_case row → camelCase object matching old Mongoose shape */
  _format(row) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      email: row.email,
      role: row.role,
      profile: {
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        healthPlaceholder: row.health_placeholder,
      },
      stripeCustomerId: row.stripe_customer_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },

  _formatFull(row) {
    const user = User._format(row)
    if (user) user.passwordHash = row.password_hash
    return user
  },
}

export default User
