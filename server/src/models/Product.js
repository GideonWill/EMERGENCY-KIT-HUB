import { query } from '../config/db.js'

const Product = {
  async findAll(activeOnly = true) {
    const sql = activeOnly
      ? 'SELECT * FROM products WHERE active = true ORDER BY created_at DESC'
      : 'SELECT * FROM products ORDER BY created_at DESC'
    const { rows } = await query(sql)
    return rows.map(Product._format)
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [id])
    return rows[0] ? Product._format(rows[0]) : null
  },

  async findBySlug(slug) {
    const { rows } = await query('SELECT * FROM products WHERE slug = $1', [slug])
    return rows[0] ? Product._format(rows[0]) : null
  },

  async findByIds(ids) {
    if (!ids.length) return []
    const { rows } = await query(
      'SELECT * FROM products WHERE id = ANY($1::int[]) AND active = true',
      [ids]
    )
    return rows.map(Product._format)
  },

  async create({ name, slug, description, priceCents, image, sku, active = true, status = 'In Stock', badge = null }) {
    const { rows } = await query(
      `INSERT INTO products (name, slug, description, price_cents, image, sku, active, status, badge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, slug, description, priceCents, image, sku, active, status, badge]
    )
    return Product._format(rows[0])
  },

  async update(id, fields) {
    const sets = []
    const vals = [id]
    let i = 2
    for (const [key, value] of Object.entries(fields)) {
      const col = Product._colMap[key]
      if (col) {
        sets.push(`${col} = $${i}`)
        vals.push(value)
        i++
      }
    }
    if (!sets.length) return Product.findById(id)
    sets.push(`updated_at = now()`)
    const { rows } = await query(
      `UPDATE products SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
      vals
    )
    return rows[0] ? Product._format(rows[0]) : null
  },

  async delete(id) {
    const { rowCount } = await query('DELETE FROM products WHERE id = $1', [id])
    return rowCount > 0
  },

  async findOneBySlug(slug) {
    return Product.findBySlug(slug)
  },

  _colMap: {
    name: 'name',
    slug: 'slug',
    description: 'description',
    priceCents: 'price_cents',
    image: 'image',
    sku: 'sku',
    active: 'active',
    status: 'status',
    badge: 'badge',
  },

  _format(row) {
    if (!row) return null
    return {
      _id: row.id,
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      priceCents: row.price_cents,
      image: row.image,
      sku: row.sku,
      active: row.active,
      status: row.status,
      badge: row.badge,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },
}

export default Product
