import 'dotenv/config'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const samples = []

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('Set DATABASE_URL in .env')
    process.exit(1)
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  let created = 0
  for (const p of samples) {
    const { rows } = await pool.query('SELECT id FROM products WHERE slug = $1', [p.slug])
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO products (name, slug, description, price_cents, image, sku, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [p.name, p.slug, p.description, p.priceCents, p.image, p.sku, p.active]
      )
      created += 1
    }
  }
  console.log(`Seed complete. Created ${created} products (skipped existing slugs).`)
  await pool.end()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
