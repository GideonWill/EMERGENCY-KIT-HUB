/**
 * Presentation / simulation mode: login and checkout run locally without API or Paystack.
 * Set VITE_DEMO_MODE=true in `.env` and restart Vite for stakeholder demos.
 */
export function isDemoMode() {
  return import.meta.env.VITE_DEMO_MODE === 'true'
}

export const DEMO_SESSION_KEY = 'tobin_ekh_demo_session'
