import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { manualEntries, firstAidCategories } from '../data/manualData'
import { CTA_PRIMARY } from '../config/brand'

export default function Manual() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEntries = manualEntries.filter(entry => {
    const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-brand-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand-300 text-sm font-bold uppercase tracking-widest">Digital Manual</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">Emergency Knowledge Hub</h1>
          <p className="mt-4 max-w-2xl text-brand-100 text-lg">
            Instant guidance for clinical and natural first aid. Expert-informed steps to keep your family safe until professional help arrives.
          </p>
          
          <div className="mt-10 max-w-xl relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-200" />
            <input
              type="text"
              placeholder="Search for an emergency (e.g., Burns, Choking)..."
              className="w-full pl-12 pr-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'all' 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
            }`}
          >
            All Guides
          </button>
          {firstAidCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-brand-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                  entry.category === 'medical' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {entry.category}
                </span>
              </div>
              <h3 className="font-display text-2xl text-slate-900 mb-3">{entry.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{entry.description}</p>
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Steps</h4>
                <ul className="space-y-3">
                  {entry.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {entry.naturalRemedy && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 italic">Natural Alternative</h4>
                  <p className="text-sm text-slate-600 italic">"{entry.naturalRemedy}"</p>
                </div>
              )}

              {entry.warning && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs">
                  <strong>Warning:</strong> {entry.warning}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No guides found matching your search. Please try another term.</p>
          </div>
        )}
      </div>
    </div>
  )
}
