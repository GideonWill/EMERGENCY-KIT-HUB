import { Link } from 'react-router-dom'
import { CTA_PRIMARY, CTA_SECONDARY, COMPANY_NAME } from '../config/brand'
import { AcademicCapIcon, BuildingOfficeIcon, Cog6ToothIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import ContentSection from '../components/ContentSection'
import Hero from '../components/Hero'

export default function Institutional() {
  return (
    <div className="bg-white">
      <Hero
        eyebrow="Partnerships & Bulk Solutions"
        title="Standardizing safety for"
        titleAccent="Ghanaian Institutions"
        subtitle={`Empower your school, workplace, or industrial site with physician-grade emergency kits customized for your specific safety requirements. Trusted by ${COMPANY_NAME} partners across Accra and beyond.`}
        primaryCta={{ to: '/contact?topic=institutional', label: 'Request institutional quote' }}
        secondaryCta={{ to: '/shop', label: 'View standard kits' }}
        image="/gh_corporate.png"
        imageAlt="Modern corporate office environment in Ghana"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div id="schools" className="flex flex-col border border-slate-100 bg-slate-50 p-8 shadow-sm scroll-mt-28">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 mb-6">
              <AcademicCapIcon className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl text-slate-900 mb-4">Schools & Universities</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Protect students and staff with kits designed for common campus emergencies. We provide specialized training modules for school nurses and first-response teams.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 mt-auto">
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Allergy-safe supplies
              </li>
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Sports injury specialized kits
              </li>
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Teacher training resources
              </li>
            </ul>
          </div>

          <div id="corporate" className="flex flex-col border border-slate-100 bg-slate-50 p-8 shadow-sm scroll-mt-28">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 mb-6">
              <BuildingOfficeIcon className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl text-slate-900 mb-4">Corporate Offices</h3>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-4">Employee Wellness</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Enhance your workplace safety culture with branded emergency kits and digital wellness access for your entire workforce.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 mt-auto">
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Custom corporate branding
              </li>
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Bulk subscription discounts
              </li>
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Wellness portal integration
              </li>
            </ul>
          </div>

          <div id="industrial" className="flex flex-col border border-slate-100 bg-slate-50 p-8 shadow-sm scroll-mt-28">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 mb-6">
              <Cog6ToothIcon className="h-7 w-7" />
            </div>
            <h3 className="font-display text-2xl text-slate-900 mb-4">Industrial & Mining</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Heavy-duty kits for high-risk environments. Compliant with international safety standards and customized for industrial first-aid protocols.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 mt-auto">
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Durable hard-case exteriors
              </li>
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Trauma-specific supplies
              </li>
              <li className="flex gap-2">
                <CheckCircleIcon className="h-5 w-5 text-brand-600 shrink-0" />
                Rapid refill logistics
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ContentSection
        eyebrow="Implementation"
        title="Customization at Scale"
        body={
          <>
            <p>
              We understand that a "one-size-fits-all" approach doesn't work for large organizations. Our team works directly with your safety officers to modify kit contents based on your facility's specific risks.
            </p>
            <p>
              From custom branding on the exterior to specific medication rotations, we ensure your institutional kit is as unique as your organization.
            </p>
          </>
        }
        cta={{ to: '/contact', label: 'Consult with a specialist' }}
        image="/inst.jpg"
        imageAlt="Modern industrial solutions in action"
        imageLeft
        mutedBg
      />

      <div id="industrial-focus" className="bg-slate-50 py-16 scroll-mt-20">
        <ContentSection
          eyebrow="Specialized Care"
          title="Heavy Industry & Mining"
          body={
            <>
              <p>
                For the extraction and industrial sectors, we provide ruggedized kits designed to withstand extreme environments. From mining sites in Obuasi to industrial zones in Tema, we standardization safety protocols.
              </p>
              <p>
                Our trauma-focused kits are optimized for the specific orthopedic and respiratory risks common in Ghanaian heavy industry.
              </p>
            </>
          }
          cta={{ to: '/shop', label: 'Shop for emergency kits' }}
          image="/gh_industrial.png"
          imageAlt="Ghanaian industrial and mining professionals"
          mutedBg={false}
        />
      </div>

      <section className="bg-brand-900 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl sm:text-4xl">Ready to standardize safety?</h2>
          <p className="mt-4 text-brand-100">Join dozens of Ghanaian institutions already partnered with {COMPANY_NAME}.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className={`px-10 py-4 text-sm font-bold uppercase tracking-widest ${CTA_PRIMARY}`}
            >
              Get a partnership quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
