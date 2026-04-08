import { Link } from 'react-router-dom'
import { CTA_PRIMARY } from '../config/brand'

/**
 * Image + text band; imageLeft controls visual order on large screens.
 */
export default function ContentSection({
  eyebrow,
  title,
  body,
  cta,
  image,
  imageAlt = '',
  imageLeft = true,
  className = '',
  mutedBg = false,
}) {
  return (
    <section
      className={`py-16 sm:py-20 ${mutedBg ? 'bg-slate-50' : 'bg-white'} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            className={`overflow-hidden border border-slate-200 shadow-lg ${
              imageLeft ? '' : 'lg:order-2'
            }`}
          >
            {image && (
              <img
                src={image}
                alt={imageAlt}
                className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:min-h-[320px]"
              />
            )}
          </div>
          <div className={imageLeft ? '' : 'lg:order-1'}>
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">{eyebrow}</p>
            )}
            <h2 className="mt-3 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">{body}</div>
            {cta && (
              <div className="mt-8">
                <Link
                  to={cta.to}
                  className={`inline-flex px-8 py-3.5 text-sm ${CTA_PRIMARY}`}
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
