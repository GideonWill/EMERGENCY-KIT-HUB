import { Link } from 'react-router-dom'
import { BookOpenIcon, UserGroupIcon, SparklesIcon, ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'

export default function WellnessHub() {
  const hubs = [
    {
      title: 'Digital Manual',
      description: 'Medical and natural first-aid guidance for home and office.',
      link: '/manual',
      icon: BookOpenIcon,
      color: 'bg-brand-50'
    },
    {
      title: 'Clinical Care',
      description: 'Book virtual consultations with licensed medical professionals.',
      link: '/consultation',
      icon: UserGroupIcon,
      color: 'bg-blue-50'
    },
    {
      title: 'Spiritual Guidance',
      description: 'Access the Circle of Prayer and holistic wellness support.',
      link: '/spiritual-guidance',
      icon: SparklesIcon,
      color: 'bg-amber-50'
    },
    {
      title: 'Restock & Refill',
      description: 'Manage your kit subscriptions and restocking alerts.',
      link: '/shop', // Update later if needed
      icon: ArrowPathIcon,
      color: 'bg-green-50'
    }
  ]

  return (
    <div className="bg-white">
      <div className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-400 font-bold uppercase tracking-[0.3em] text-xs">Premium Care</p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-white">The Wellness Hub</h1>
          <p className="mt-6 max-w-2xl mx-auto text-slate-300 text-lg leading-relaxed">
            Your centralized destination for clinical expertise, natural remedies, and spiritual support. Preparedness is not just about tools—it’s about knowledge.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {hubs.map((hub) => (
            <Link 
              key={hub.title}
              to={hub.link}
              className={`group flex flex-col p-10 ${hub.color} border border-transparent hover:border-slate-200 transition-all duration-300`}
            >
              <hub.icon className="h-10 w-10 text-brand-700 mb-6 group-hover:scale-110 transition-transform" />
              <h2 className="font-display text-3xl text-slate-900 mb-4 group-hover:text-brand-800 transition-colors">
                {hub.title}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                {hub.description}
              </p>
              <span className="mt-auto text-sm font-bold uppercase tracking-widest text-brand-700 flex items-center gap-2">
                Explore section
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <section className="bg-brand-50/50 py-20 border-t border-slate-100">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl text-slate-900">Why the Hub matters?</h2>
          <p className="mt-6 text-slate-600 leading-relaxed">
            Following the TOBINCO Strategic Implementation Approach, we bridge the gap between emergency supplies and immediate action. The Hub provides the "Digital Manual" component of your physical kit, ensuring you are never alone in a crisis.
          </p>
          <div className="mt-10 flex justify-center gap-4">
             <Link to="/about" className={`px-8 py-3 text-sm ${CTA_PRIMARY}`}>Our Philosophy</Link>
             <Link to="/membership" className={`px-8 py-3 text-sm ${CTA_SECONDARY}`}>Join Membership</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
