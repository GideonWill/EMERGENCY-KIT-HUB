import 'dotenv/config';
import { query } from './src/config/db.js';

async function check() {
  try {
    const { rows } = await query('SELECT count(*) FROM products');
    console.log('Product count:', rows[0].count);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
