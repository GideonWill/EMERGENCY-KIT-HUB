import { COMPANY_NAME, getYoutubeEmbedId } from '../config/brand'

/**
 * Looping muted YouTube embed (autoplay subject to browser policy).
 */
export default function EmergencyKitVideo() {
  const id = getYoutubeEmbedId()
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&modestbranding=1&playsinline=1`

  return (
    <section className="border-y border-slate-200 bg-slate-900 py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-brand-300">Video guide</p>
        <h2 className="mt-2 text-center font-display text-2xl text-white sm:text-3xl">
          How emergency kits are used
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-300">
          Educational overview from trusted preparedness sources. {COMPANY_NAME} recommends reviewing your kit&apos;s
          printed guide and following licensed medical advice for medications.
        </p>
        <div className="mt-10 overflow-hidden border border-slate-600 bg-black shadow-2xl">
          <div className="relative aspect-video w-full">
            <iframe
              title="Emergency kit preparedness video"
              src={src}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          Video hosted on YouTube for demonstration. Replace <code className="text-slate-400">VITE_YOUTUBE_EMBED_ID</code>{' '}
          in <code className="text-slate-400">.env</code> to use your own clip.
        </p>
      </div>
    </section>
  )
}
