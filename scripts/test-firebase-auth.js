import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config({ path: './twc-inspired/.env' });

const API_KEY = process.env.VITE_FIREBASE_API_KEY;
if (!API_KEY) {
  console.error('❌ VITE_FIREBASE_API_KEY not set in .env');
  process.exit(1);
}

// Helper to call Firebase Auth REST endpoints
async function callFirebase(endpoint, body) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${endpoint} failed: ${JSON.stringify(data)}`);
  return data;
}

(async () => {
  const email = 'testuser@example.com';
  const password = 'Test1234!';

  console.log('🔧 Creating test user...');
  const create = await callFirebase('signUp', { email, password, returnSecureToken: true });
  console.log('✅ User created, uid:', create.localId);

  console.log('🔐 Signing in...');
  const signIn = await callFirebase('signInWithPassword', { email, password, returnSecureToken: true });
  console.log('✅ Signed in! ID token:', signIn.idToken.slice(0, 30) + '…');

  console.log('🧹 Cleaning up – deleting test user...');
  await callFirebase('delete', { localId: create.localId, idToken: signIn.idToken });
  console.log('✅ Cleanup complete.');
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
