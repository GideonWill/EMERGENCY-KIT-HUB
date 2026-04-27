import 'dotenv/config';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

async function run() {
  const email = 'admin@emergencykithub.com';
  const password = 'AdminPassword123!';
  
  const existing = await User.findByEmail(email);
  if (existing) {
    console.log('Admin user already exists.');
    // Ensure it's an admin
    if (existing.role !== 'admin') {
        console.log('Upgrading existing user to admin...');
        // We'd need an update method or direct SQL
    }
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    passwordHash,
    firstName: 'System',
    lastName: 'Admin',
    role: 'admin',
  });

  console.log('Admin user created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
