import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Enable WebSocket support for Node.js runtime
neonConfig.webSocketConstructor = ws

let pool

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }
    pool = new Pool({ connectionString })
  }
  return pool
}

export async function connectDb() {
  const p = getPool()
  await p.query('SELECT 1')
  console.log('✅ Neon Postgres connected')
  return p
}

/**
 * Helper to run a single parameterised query.
 * Usage: const { rows } = await query('SELECT * FROM users WHERE id = $1', [id])
 */
export function query(text, params) {
  return getPool().query(text, params)
}
