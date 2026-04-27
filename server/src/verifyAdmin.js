import 'dotenv/config';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

async function run() {
  const email = 'admin@emergencykithub.com';
  const password = 'AdminPassword123!';
  
  const user = await User.findByEmailWithPassword(email);
  if (!user) {
    console.log('User not found.');
    process.exit(1);
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  console.log('Password match:', match);
  console.log('User Role:', user.role);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
