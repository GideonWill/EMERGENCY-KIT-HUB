import { Link } from 'react-router-dom'
import { CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'

/**
 * Full-width hero with optional image, eyebrow, CTAs — medical / wellness layout.
 */
export default function Hero({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  primaryCta = { to: '/shop', label: 'Shop the collection' },
  secondaryCta,
  image,
  imageAlt = '',
  reversed = false,
}) {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-brand-50/80 to-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div className={reversed ? 'lg:order-2' : ''}>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">{eyebrow}</p>
          )}
          <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="text-brand-700">{titleAccent}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{subtitle}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={primaryCta.to}
              className={`inline-flex items-center justify-center px-8 py-3.5 text-sm ${CTA_PRIMARY}`}
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                to={secondaryCta.to}
                className={`inline-flex items-center justify-center px-8 py-3.5 text-sm ${CTA_SECONDARY}`}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
        {image && (
          <div className={reversed ? 'lg:order-1' : ''}>
            <div className="relative aspect-[4/3] overflow-hidden border border-slate-200 shadow-xl lg:aspect-square">
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-900/10 to-transparent" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
