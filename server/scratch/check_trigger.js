import 'dotenv/config'
import { query } from '../src/config/db.js'

async function check() {
  try {
    console.log('Checking users table...')
    const { rows: columns } = await query(`
      SELECT column_name, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'users'
    `)
    console.table(columns)

    console.log('\nChecking trigger definition...')
    const { rows: triggers } = await query(`
      SELECT pg_get_triggerdef(oid) as definition
      FROM pg_trigger
      WHERE tgname = 'trg_sync_neon_auth_user'
    `)
    if (triggers.length > 0) {
      console.log('Trigger found:', triggers[0].definition)
    } else {
      console.log('Trigger NOT found!')
    }

    console.log('\nChecking trigger function...')
    const { rows: functions } = await query(`
      SELECT prosrc
      FROM pg_proc
      WHERE proname = 'sync_neon_auth_user'
    `)
    if (functions.length > 0) {
      console.log('Function body:\n', functions[0].prosrc)
    } else {
      console.log('Function NOT found!')
    }

  } catch (err) {
    console.error('Error:', err)
  } finally {
    process.exit()
  }
}

check()
