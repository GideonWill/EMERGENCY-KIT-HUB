import { query } from '../config/db.js'

const Appointment = {
  async create({ userId, scheduledAt, timeSlot, notes, category = 'medical', status = 'requested' }) {
    const { rows } = await query(
      `INSERT INTO appointments (user_id, scheduled_at, time_slot, notes, category, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, scheduledAt, timeSlot || null, notes || null, category, status]
    )
    return Appointment._format(rows[0])
  },

  async findByUser(userId) {
    const { rows } = await query(
      'SELECT * FROM appointments WHERE user_id = $1 ORDER BY scheduled_at ASC',
      [userId]
    )
    return rows.map(Appointment._format)
  },

  async findAllWithUser() {
    const { rows } = await query(
      `SELECT a.*, u.email, u.first_name, u.last_name
       FROM appointments a
       LEFT JOIN users u ON u.id = a.user_id
       ORDER BY a.scheduled_at ASC`
    )
    return rows.map((row) => {
      const appt = Appointment._format(row)
      appt.user = {
        _id: row.user_id,
        email: row.email,
        profile: { firstName: row.first_name, lastName: row.last_name },
      }
      return appt
    })
  },

  async updateStatus(id, status) {
    const { rows } = await query(
      'UPDATE appointments SET status = $2, updated_at = now() WHERE id = $1 RETURNING *',
      [id, status]
    )
    return rows[0] ? Appointment._format(rows[0]) : null
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM appointments WHERE id = $1', [id])
    return rows[0] ? Appointment._format(rows[0]) : null
  },

  _format(row) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      user: row.user_id,
      scheduledAt: row.scheduled_at,
      timeSlot: row.time_slot,
      notes: row.notes,
      category: row.category,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },
}

export default Appointment
