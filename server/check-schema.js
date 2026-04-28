import 'dotenv/config';
import { query } from './src/config/db.js';

async function check() {
  try {
    await query("ALTER TABLE orders DROP CONSTRAINT orders_status_check;");
    await query("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'));");
    console.log('Constraint updated successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
