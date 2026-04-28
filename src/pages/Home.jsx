import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AcademicCapIcon, BuildingOfficeIcon, Cog6ToothIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import ProductCard from '../components/ProductCard'
import ContentSection from '../components/ContentSection'
import EmergencyKitHealthTips from '../components/EmergencyKitHealthTips'
import EmergencyKitVideo from '../components/EmergencyKitVideo'
import TrendingSpotlightTile from '../components/TrendingSpotlightTile'
import { products as initialProducts, testimonials, team } from '../data/products'
import { COMPANY_NAME, CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import { apiFetch } from '../lib/api'

const collectionLinks = [
  { to: '/shop?collection=bestsellers', label: 'Best sellers' },
  { to: '/shop', label: 'Shop all' },
  { to: '/wellness', label: 'Wellness Hub' },
  { to: '/manual', label: 'Digital Manual' },
  { to: '/membership#plans', label: 'Memberships' },
]

const spotlight = initialProducts.slice(0, 5)

export default function Home() {
  const [catalog, setCatalog] = useState([])

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await apiFetch('/api/products')
        if (res.success && res.data) {
          const merged = res.data.map((p) => {
            const staticMatch = initialProducts.find((sp) => sp.slug === p.slug || String(sp.id) === String(p.id))
            return {
              ...staticMatch,
              ...p,
              price: p.priceCents ? p.priceCents / 100 : (staticMatch?.price || 0),
              tagline: staticMatch?.tagline || 'Premium wellness support.',
            }
          })
          setCatalog(merged)
        }
      } catch (err) {
        console.error('Failed to load catalog:', err)
        setCatalog(initialProducts) // Fallback for UI purposes
      }
    }
    loadCatalog()
  }, [])

  const currentSpotlight = catalog.length ? catalog.slice(0, 5) : initialProducts.slice(0, 5)
  const currentFeatured = catalog.length ? catalog.slice(0, 4) : initialProducts.slice(0, 4)

  return (
    <>
      {/* Hero — copy left; image flush to right viewport edge on large screens */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50/90 to-white">
        <div className="lg:flex lg:min-h-[min(520px,88vh)]">
          <div className="flex flex-shrink-0 flex-col justify-center px-4 py-10 sm:px-6 lg:w-[min(48%,520px)] lg:max-w-xl lg:flex-none lg:py-14 lg:pl-8 xl:pl-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700 sm:text-xs">
              {COMPANY_NAME}
            </p>
            <h1 className="mt-4 font-display text-[2rem] leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[2.65rem]">
              Emergency kits, care access &amp;{' '}
              <span className="text-brand-800">premium supplements</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600">
              Physician-informed formulas and preparedness tools for families who want clarity and
              quality — backed by {COMPANY_NAME}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className={`inline-flex items-center justify-center px-7 py-3 text-sm ${CTA_PRIMARY}`}
              >
                Shop products
              </Link>
              <Link
                to="/membership#plans"
                className={`inline-flex items-center justify-center px-7 py-3 text-sm ${CTA_SECONDARY}`}
              >
                Explore membership
              </Link>
              <Link
                to="/consultation"
                className={`inline-flex items-center justify-center px-7 py-3 text-sm ${CTA_SECONDARY} border-brand-200 hover:border-brand-300 bg-white hover:bg-slate-50`}
              >
                Book consultation
              </Link>
            </div>
          </div>
          <div className="relative mt-6 min-h-[260px] w-full flex-1 lg:mt-0 lg:min-h-0">
            <img
              src="/hero section home.png"
              alt="TOBINCO Medical Emergency Kit surrounded by first-aid supplies"
              className="h-full min-h-[260px] w-full object-contain object-center lg:absolute lg:inset-0 lg:min-h-full"
            />
          </div>
        </div>

        <div className="border-t border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pt-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Trending now
            </p>
            <div className="flex gap-4 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
              {currentSpotlight.map((p) => (
                <TrendingSpotlightTile key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <EmergencyKitHealthTips />
      <EmergencyKitVideo />

      {/* Institutional / Corporate Solutions */}
      <section className="bg-slate-50 py-16 sm:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">Institutional Solutions</p>
              <h2 className="mt-4 font-display text-3xl text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
                Standardizing safety for <span className="text-brand-800 italic font-medium">Schools &amp; Workplaces</span>
              </h2>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Beyond home care, {COMPANY_NAME} provides bulk emergency preparedness solutions for Ghanaian institutions. From customized kits for mining sites to first-aid stations for universities.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/institutional"
                  className={`px-8 py-3 text-sm font-bold uppercase tracking-widest ${CTA_PRIMARY}`}
                >
                  Explore partnerships
                </Link>
                <Link
                  to="/contact?topic=institutional"
                  className="inline-flex items-center text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
                >
                  Request bulk quote <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 flex-1 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 shadow-sm border border-slate-200/60 rounded-sm">
                <AcademicCapIcon className="h-8 w-8 text-brand-600 mb-4" />
                <h4 className="font-display text-lg text-slate-900">Schools</h4>
                <p className="mt-2 text-sm text-slate-500">Student-safe kits and staff training modules.</p>
              </div>
              <div className="bg-white p-6 shadow-sm border border-slate-200/60 rounded-sm">
                <BuildingOfficeIcon className="h-8 w-8 text-brand-600 mb-4" />
                <h4 className="font-display text-lg text-slate-900">Corporate</h4>
                <h5 className="text-[10px] uppercase font-bold text-brand-600 mt-1">Branding available</h5>
                <p className="mt-2 text-sm text-slate-500">Employee wellness kits for office safety.</p>
              </div>
              <div className="bg-white p-6 shadow-sm border border-slate-200/60 rounded-sm col-span-2">
                <div className="flex items-center gap-4">
                  <Cog6ToothIcon className="h-10 w-10 text-brand-600" />
                  <div>
                    <h4 className="font-display text-lg text-slate-900">Industrial &amp; Mining</h4>
                    <p className="mt-1 text-sm text-slate-500">Heavy-duty trauma kits compliant with safety standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections — text row */}
      <section className="border-b border-slate-200 bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-1 gap-y-2 px-4 text-sm sm:px-6 lg:px-8">
          <span className="font-semibold text-slate-800">Our collections</span>
          <span className="hidden text-slate-300 sm:inline" aria-hidden>
            ·
          </span>
          {collectionLinks.map(({ to, label }, i) => (
            <span key={to} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-slate-300" aria-hidden>
                  ·
                </span>
              )}
              <Link
                to={to}
                className="font-medium text-slate-600 underline-offset-4 transition-colors duration-300 ease-out hover:text-brand-800 hover:underline"
              >
                {label}
              </Link>
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">Most popular</p>
              <h2 className="mt-2 font-display text-3xl text-slate-900 sm:text-4xl">Own your wellness</h2>
              <p className="mt-2 max-w-xl text-slate-600">Best sellers this month — placeholder ratings.</p>
            </div>
            <Link
              to="/shop"
              className={`shrink-0 self-start px-6 py-2.5 text-sm sm:self-auto ${CTA_PRIMARY}`}
            >
              Shop the collection
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {currentFeatured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-900 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl">See what&apos;s new</h2>
          <p className="mt-2 max-w-2xl text-sm text-brand-100 sm:text-base">
            New arrivals and spotlight formulas — tap through to product pages.
          </p>
          <div className="mt-10 grid gap-px bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
            {catalog.slice(2, 6).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group border border-transparent bg-brand-900 transition-all duration-300 ease-out hover:bg-brand-800"
              >
                <div className="aspect-[5/4] overflow-hidden bg-brand-950">
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="border-t border-white/10 p-4">
                  <h3 className="font-display text-lg text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-brand-100/90">{p.tagline}</p>
                  <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-white underline-offset-4 transition-opacity group-hover:underline">
                    Shop now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContentSection
        eyebrow="Clinical standards"
        title="Preparedness meets everyday care"
        body={
          <>
            <p>
              {COMPANY_NAME} brings together clean medical e-commerce design with forest-green accents,
              generous whitespace, and serif headlines — so your family can shop and plan with confidence.
            </p>
            <p>
              Replace this copy with your value proposition, compliance language, and trust badges as your
              catalog goes live.
            </p>
          </>
        }
        cta={{ to: '/about', label: 'Our story' }}
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=80"
        imageAlt="Healthcare professional with patient"
        imageLeft
        mutedBg
      />

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl text-slate-900 sm:text-4xl">
            What our customers are saying
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.author}
                className="border border-slate-200 bg-brand-50/50 p-6 shadow-sm"
              >
                <p className="text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm">
                  <cite className="font-semibold not-italic text-slate-900">{t.author}</cite>
                  <p className="text-brand-700">{t.product}</p>
                  <p className="text-xs text-slate-500">Verified purchase · Demo</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl text-slate-900 sm:text-4xl">
            Medical advisory board
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Chief medical board — placeholder profiles for layout.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <img src={member.image} alt="" className={`aspect-[4/5] w-full object-cover ${member.objectPosition || 'object-center'}`} />
                <div className="border-t border-slate-200 p-5">
                  <h3 className="font-display text-xl text-slate-900">{member.name}</h3>
                  <p className="text-sm font-semibold text-brand-700">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-600 py-12 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-2xl sm:text-3xl">Ready to stock your cabinet?</h2>
          <p className="mt-3 text-brand-100">Browse the full catalog or talk to our team.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex border-2 border-amber-400 bg-amber-400 px-8 py-3.5 text-sm font-semibold text-brand-950 transition-all duration-300 ease-out hover:border-amber-300 hover:bg-amber-300"
            >
              Shop all products
            </Link>
            <Link
              to="/contact"
              className="inline-flex border-2 border-white px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-white/15"
            >
              Contact us
            </Link>
            <Link
              to="/consultation"
              className="inline-flex border-2 border-white px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-white/15"
            >
              Book consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
