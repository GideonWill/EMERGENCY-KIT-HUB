/** Base URL for Express API — set in `.env` as VITE_API_URL (no trailing slash) */
export function getApiBase() {
  let raw = import.meta.env.VITE_API_URL
  if (!raw || typeof raw !== 'string') return ''
  
  // Fix for mobile/external devices: 
  // If the app is accessed via IP (e.g. on a phone), but the API URL is still "localhost",
  // we dynamically replace "localhost" with the current hostname so the phone can reach the PC server.
  if (raw.includes('localhost') && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    raw = raw.replace('localhost', window.location.hostname)
  }

  return raw.replace(/\/$/, '')
}

const TOKEN_KEY = 'tobin_ekh_token'
const LEGACY_TOKEN_KEYS = ['vitawell_token']

export function getStoredToken() {
  let t = localStorage.getItem(TOKEN_KEY)
  if (t) return t
  for (const k of LEGACY_TOKEN_KEYS) {
    t = localStorage.getItem(k)
    if (t) {
      localStorage.setItem(TOKEN_KEY, t)
      localStorage.removeItem(k)
      return t
    }
  }
  return ''
}

export function setStoredToken(token) {
  for (const k of LEGACY_TOKEN_KEYS) {
    localStorage.removeItem(k)
  }
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path, options = {}) {
  const base = getApiBase()
  const headers = new Headers(options.headers)
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getStoredToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const url = `${base}${path}`
  const res = await fetch(url, { ...options, headers })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: text || res.statusText }
  }
  if (!res.ok) {
    const msg = data.message || data.errors?.[0]?.msg || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function createSubscriptionCheckoutSession() {
  return apiFetch('/api/subscriptions/create-checkout-session', { method: 'POST' })
}
