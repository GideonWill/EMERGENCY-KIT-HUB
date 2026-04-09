import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { COMPANY_NAME, CTA_PRIMARY, CTA_SECONDARY, LOGO_SRC } from '../config/brand'

const shopCollections = [
  {
    to: '/shop?collection=bestsellers',
    label: 'Best sellers',
    hint: 'Customer favorites & kits',
  },
  { to: '/shop', label: 'Shop all', hint: 'Full catalog' },
  {
    to: '/shop?collection=supplements',
    label: 'Supplements',
    hint: 'Daily wellness formulas',
  },
  { to: '/membership', label: 'Memberships', hint: 'Care & savings plans' },
]

const navClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium ${
    isActive
      ? 'text-brand-700 font-semibold'
      : 'text-slate-600 hover:text-brand-700 transition-colors'
  }`

function ChevronDown({ className }) {
  return (
    <svg className={className} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function Navbar() {
  const { count: cartCount } = useCart()
  const { isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 py-2"
        >
          <img
            src={LOGO_SRC}
            alt=""
            width={280}
            height={90}
            className="h-12 w-auto max-h-16 object-contain object-left sm:h-14"
          />
          <span className="sr-only">{COMPANY_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-0 md:flex" aria-label="Main">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>

          {/* Mega dropdown — hover + focus-within (reference-style wide panel) */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 outline-none transition-colors hover:text-brand-700 group-hover:text-brand-700"
              aria-expanded={false}
              aria-haspopup="true"
            >
              Shop
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            <div
              className="invisible absolute left-1/2 top-full z-50 w-[min(calc(100vw-2rem),44rem)] -translate-x-1/2 border-t-2 border-brand-600 bg-white pt-0 opacity-0 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)] transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
              role="navigation"
              aria-label="Shop menu"
            >
              {/* Hover bridge */}
              <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" aria-hidden />
              <div className="grid grid-cols-1 border border-t-0 border-slate-200 sm:grid-cols-[1fr_13rem]">
                <div className="p-6 sm:p-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Our collections
                  </p>
                  <ul className="mt-5 grid gap-1 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-1">
                    {shopCollections.map(({ to, label, hint }) => (
                      <li key={to}>
                        <Link
                          to={to}
                          className="block px-2 py-2.5 transition hover:bg-brand-50 sm:-mx-2"
                        >
                          <span className="block text-base font-semibold text-slate-900">{label}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <Link
                      to="/shop"
                      className="text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
                    >
                      View all products →
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col justify-center border-t border-slate-100 bg-slate-50 p-6 sm:border-l sm:border-t-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Featured
                  </p>
                  <p className="mt-3 font-display text-lg leading-snug text-slate-900">
                    Stock up &amp; save on kits
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Bundle essentials for home and travel. Demo promotion copy.
                  </p>
                  <Link
                    to="/shop?collection=bestsellers"
                    className={`mt-5 inline-flex w-full items-center justify-center py-2.5 text-center text-xs font-bold uppercase tracking-wide ${CTA_PRIMARY}`}
                  >
                    Shop best sellers
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Care — consultation & spiritual support */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 outline-none transition-colors hover:text-brand-700 group-hover:text-brand-700"
              aria-haspopup="true"
            >
              Care
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-[min(calc(100vw-2rem),22rem)] -translate-x-1/2 border-t-2 border-brand-600 bg-white pt-0 opacity-0 shadow-xl transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" aria-hidden />
              <div className="border border-t-0 border-slate-200 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Care &amp; counsel</p>
                <ul className="mt-3 space-y-1">
                  <li>
                    <Link
                      to="/consultation"
                      className="block border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <span className="block text-sm font-semibold text-slate-900">Consultation</span>
                      <span className="text-xs text-slate-500">Licensed health practitioners</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/spiritual-guidance"
                      className="block border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <span className="block text-sm font-semibold text-slate-900">Spiritual guidance</span>
                      <span className="text-xs text-slate-500">Church of Pentecost pastoral care</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
          <NavLink to="/membership" className={navClass}>
            Membership
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
          <NavLink to="/tracking" className={navClass}>
            Tracking
          </NavLink>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/cart"
            className={`relative px-4 py-2.5 text-sm ${CTA_SECONDARY}`}
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-brand-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/admin/orders"
                className={`px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-slate-50`}
              >
                Admin Portal
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className={`px-4 py-2.5 text-sm ${CTA_SECONDARY}`}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-2.5 text-sm ${CTA_SECONDARY}`}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2.5 text-sm ${CTA_SECONDARY}`}
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            to="/shop"
            className={`inline-flex items-center justify-center px-5 py-2.5 text-sm ${CTA_PRIMARY}`}
          >
            Shop collection
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <div className="flex items-center gap-1 pr-1 border-r border-slate-300">
              <Link
                to="/admin/orders"
                className="p-2 text-slate-700 hover:text-brand-700"
                aria-label="Admin Portal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="p-2 text-slate-700 hover:text-brand-700"
                aria-label="Sign out"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 pr-1 border-r border-slate-300">
              <Link to="/login" className="p-2 text-slate-700 hover:text-brand-700" aria-label="Login">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
              <Link to="/register" className="p-2 text-slate-700 hover:text-brand-700" aria-label="Sign up">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </Link>
            </div>
          )}
          <Link
            to="/cart"
            className="group relative p-2 text-slate-700 hover:text-brand-700"
            aria-label="Cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex border border-transparent p-2 text-slate-700 hover:border-slate-200"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1 pb-6" aria-label="Mobile">
            <NavLink
              to="/"
              className="px-3 py-3 text-slate-800"
              onClick={() => setMobileOpen(false)}
              end
            >
              Home
            </NavLink>
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Care
            </p>
            <Link
              to="/consultation"
              className="px-3 py-2 pl-6 text-slate-700"
              onClick={() => setMobileOpen(false)}
            >
              Consultation
            </Link>
            <Link
              to="/spiritual-guidance"
              className="px-3 py-2 pl-6 text-slate-700"
              onClick={() => setMobileOpen(false)}
            >
              Spiritual guidance
            </Link>
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Shop — collections
            </p>
            {shopCollections.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-2 pl-6 text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/shop"
              className="px-3 py-2 pl-6 text-sm font-semibold text-brand-700"
              onClick={() => setMobileOpen(false)}
            >
              View all products
            </Link>
            <NavLink
              to="/about"
              className="px-3 py-3 text-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/membership"
              className="px-3 py-3 text-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              Membership
            </NavLink>
            <NavLink
              to="/contact"
              className="px-3 py-3 text-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </NavLink>
            <NavLink
              to="/tracking"
              className="px-3 py-3 text-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              Tracking
            </NavLink>
            <Link
              to="/cart"
              className="px-3 py-3 text-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              Cart{cartCount > 0 ? ` (${cartCount})` : ''}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/orders"
                  className="px-3 py-3 text-left text-brand-700 font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Portal
                </Link>
                <button
                  type="button"
                  className="px-3 py-3 text-left text-slate-800"
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-3 text-slate-800"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-3 text-slate-800"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
            <Link
              to="/shop"
              className={`mt-2 block px-5 py-3 text-center text-sm ${CTA_PRIMARY}`}
              onClick={() => setMobileOpen(false)}
            >
              Shop collection
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
