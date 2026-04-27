import 'dotenv/config';
import { query } from './src/config/db.js';

async function check() {
  try {
    const { rows } = await query('SELECT email, role FROM users');
    console.log('Users:', rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
