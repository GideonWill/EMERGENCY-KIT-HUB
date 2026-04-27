import 'dotenv/config';
import { query } from './src/config/db.js';

async function check() {
  try {
    const { rows } = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'products'");
    console.log('Columns:', rows.map(r => r.column_name));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
