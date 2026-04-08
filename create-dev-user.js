import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config({ path: './twc-inspired/.env' });

const API_KEY = process.env.VITE_FIREBASE_API_KEY;

async function callFirebase(endpoint, body) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

(async () => {
  const email = 'demo@example.com';
  const password = 'Password123!';

  console.log('Creating demo user...');
  const create = await callFirebase('signUp', { email, password, returnSecureToken: true });
  console.log('User created:', email, password);
})().catch(console.error);
