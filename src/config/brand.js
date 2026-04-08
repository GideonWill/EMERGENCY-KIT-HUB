import logoPng from '../assets/logo.png'

/** Tobin Emergency Kit Hub — central branding */
export const COMPANY_NAME = 'TOBIN EMERGENCY KIT HUB'
export const COMPANY_NAME_SHORT = 'Tobin Emergency Kit Hub'
export const SUPPORT_EMAIL = 'care@tobinemergencykithub.com'

/** Resolved URL for Vite (imported from `src/assets/logo.png`) */
export const LOGO_SRC = logoPng

/** Default embed (override via VITE_YOUTUBE_EMBED_ID) — https://youtu.be/KKN7Ewht1DQ */
export const DEFAULT_YOUTUBE_EMBED_ID = 'KKN7Ewht1DQ'

/**
 * Primary actions — strong green, always visible on white/light backgrounds.
 * Use with padding utilities, e.g. `className={\`${CTA_PRIMARY} px-6 py-3 text-sm\`}`.
 */
export const CTA_PRIMARY =
  'bg-brand-cta font-semibold text-white shadow-md transition hover:bg-brand-cta-hover disabled:cursor-not-allowed disabled:opacity-60'

/**
 * Secondary / outline actions — visible gray fill, not white-on-white.
 */
export const CTA_SECONDARY =
  'bg-slate-100 font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-60'

export function getYoutubeEmbedId() {
  const fromEnv = import.meta.env.VITE_YOUTUBE_EMBED_ID
  return (typeof fromEnv === 'string' && fromEnv.trim()) || DEFAULT_YOUTUBE_EMBED_ID
}
