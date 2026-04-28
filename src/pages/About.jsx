import { Link } from 'react-router-dom'
import { CTA_PRIMARY, COMPANY_NAME } from '../config/brand'

export default function About() {
  return (
    <div className="bg-white">
      {/* Featured Brand Image */}
      <div className="w-full bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <img 
            src="/hero section home.png" 
            alt="TOBINCO Medical Emergency Kit" 
            className="w-full h-auto max-h-[500px] object-contain object-center py-12"
          />
        </div>
      </div>

      {/* Narrative Header */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">The Story Behind the Hub</p>
        <h1 className="mt-6 font-display text-4xl text-slate-900 sm:text-6xl">
          Standardizing safety for a <span className="text-brand-700 italic">resilient Ghana.</span>
        </h1>
        <div className="mt-12 space-y-8 text-left text-lg leading-relaxed text-slate-600 sm:text-xl">
          <p>
            The idea for <span className="font-semibold text-slate-900">{COMPANY_NAME}</span> was born from a simple yet urgent observation: in moments of crisis, the difference between a minor incident and a tragedy often comes down to the first sixty seconds. 
          </p>
          
          <p>
            We realized that while many Ghanaians are deeply committed to the health and safety of their families and employees, most environments—from homes and schools to corporate offices and mining sites—lacked the standardized, high-quality medical tools required for immediate response.
          </p>

          <div className="border-l-4 border-brand-500 bg-brand-50/50 p-8">
            <h2 className="font-display text-2xl text-slate-900 mb-4">Bridging the Gap</h2>
            <p className="text-slate-700">
              Emergency preparedness shouldn't be a luxury. It should be a standard. We set out to create more than just a medical supply company; we wanted to build a bridge between professional clinical care and everyday life.
            </p>
          </div>

          <p>
            The <span className="font-semibold text-slate-900">TOBINCO Strategic Implementation Approach</span> was developed to ensure that every physical kit we provide is backed by digital intelligence. We don't just ship boxes; we provide a lifeline through our Wellness Hub and Digital Manual, ensuring that when an emergency happens, the "how-to" is just as accessible as the supplies themselves.
          </p>
        </div>
      </section>

      {/* How it Helps Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <h3 className="font-display text-3xl text-slate-900">For Families</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                We provide parents and caregivers with the peace of mind that comes from being truly prepared. Our home kits are designed for speed and simplicity, accompanied by pastoral care and pediatric guidance.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-slate-900">For Institutions</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                We help schools and offices meet international safety standards. By standardizing first-aid protocols across large organizations, we minimize workplace risk and protect Ghana's most valuable asset: its people.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl text-slate-900">For Industry</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                In the mining and industrial sectors, where risks are higher, we provide ruggedized, trauma-focused solutions that withstand the toughest conditions, ensuring safety even in the most remote locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl text-slate-900">Be part of the mission.</h2>
          <p className="mt-6 text-slate-600 text-lg">
            Join the thousands of Ghanaians standardizing their safety protocols with professional-grade support.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/shop" className={`px-10 py-4 text-sm font-bold uppercase tracking-widest ${CTA_PRIMARY}`}>
              Shop for kits
            </Link>
            <Link to="/contact" className="px-10 py-4 text-sm font-bold uppercase tracking-widest border border-slate-200 text-slate-900 hover:bg-slate-50 transition-colors">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
