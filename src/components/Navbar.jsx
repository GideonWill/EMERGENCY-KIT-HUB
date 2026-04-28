import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDownIcon, ShoppingCartIcon, UserIcon, UserPlusIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { COMPANY_NAME, CTA_PRIMARY, CTA_SECONDARY, LOGO_SRC } from '../config/brand'
import LogoutConfirmModal from './LogoutConfirmModal'
import LoadingOverlay from './LoadingOverlay'

const shopCollections = [
  { to: '/shop', label: 'Shop all', hint: 'Full catalog' },
  {
    to: '/shop?collection=supplements',
    label: 'Supplements',
    hint: 'Daily wellness formulas',
  },
  { to: '/membership', label: 'Memberships', hint: 'Care & savings plans' },
  { to: '/institutional', label: 'Institutional solutions', hint: 'Bulk care for organizations' },
  { to: '/institutional#schools', label: 'Schools & Education', hint: 'Campus safety solutions' },
  { to: '/institutional#corporate', label: 'Workplaces & Offices', hint: 'Employee wellness kits' },
  { to: '/institutional#industrial-focus', label: 'Industrial & Mining', hint: 'Heavy-duty trauma kits' },
]

const navClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium ${
    isActive
      ? 'text-brand-700 font-semibold'
      : 'text-slate-600 hover:text-brand-700 transition-colors'
  }`

export default function Navbar() {
  const { count: cartCount } = useCart()
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [careOpen, setCareOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

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
          onClick={() => { setShopOpen(false); setCareOpen(false); }}
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
          <NavLink to="/" className={navClass} onClick={() => { setShopOpen(false); setCareOpen(false); }} end>
            Home
          </NavLink>

          {/* Mega dropdown — State-controlled for better UX */}
          <div 
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium outline-none transition-colors ${shopOpen ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`}
              aria-expanded={shopOpen}
              aria-haspopup="true"
            >
              Shop
              <ChevronDownIcon className={`h-4 w-4 shrink-0 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
              className={`absolute left-0 right-0 top-full z-50 mx-auto w-[min(calc(100vw-2rem),72rem)] border-t-2 border-brand-600 bg-white shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)] transition-all duration-150 ${
                shopOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-1'
              }`}
              role="navigation"
              aria-label="Shop menu"
            >
              {/* Hover bridge */}
              <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" aria-hidden />
              <div className="grid grid-cols-1 border border-t-0 border-slate-200 sm:grid-cols-[1fr_18rem]">
                <div className="p-8 sm:p-10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Our collections
                  </p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-2">
                    {shopCollections.map(({ to, label, hint }) => (
                      <li key={to}>
                        <Link
                          to={to}
                          className="block px-3 py-3 transition hover:bg-brand-50 sm:-mx-3"
                          onClick={() => setShopOpen(false)}
                        >
                          <span className="block text-base font-semibold text-slate-900">{label}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <Link
                      to="/shop"
                      className="text-sm font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-800"
                      onClick={() => setShopOpen(false)}
                    >
                      View all products →
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col justify-center border-t border-slate-100 bg-slate-50 p-8 sm:border-l sm:border-t-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Featured
                  </p>
                  <p className="mt-4 font-display text-xl leading-tight text-slate-900">
                    Stock up &amp; save on kits
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Bundle essentials for home and travel. Demo promotion copy.
                  </p>
                  <Link
                    to="/shop"
                    className={`mt-6 inline-flex w-full items-center justify-center py-3 text-center text-xs font-bold uppercase tracking-wide ${CTA_PRIMARY}`}
                    onClick={() => setShopOpen(false)}
                  >
                    Shop all products
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Care — consultation & spiritual support */}
          <div 
            onMouseEnter={() => setCareOpen(true)}
            onMouseLeave={() => setCareOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium outline-none transition-colors ${careOpen ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`}
              aria-haspopup="true"
              aria-expanded={careOpen}
            >
              Care & Knowledge
              <ChevronDownIcon className={`h-4 w-4 shrink-0 transition-transform duration-200 ${careOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`absolute left-0 right-0 top-full z-50 mx-auto w-[min(calc(100vw-2rem),28rem)] border-t-2 border-brand-600 bg-white shadow-xl transition-all duration-150 ${
                careOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-1'
              }`}>
              <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" aria-hidden />
              <div className="border border-t-0 border-slate-200 p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Clinical & Natural Support</p>
                <ul className="mt-3 space-y-1">
                  <li>
                    <Link
                      to="/wellness"
                      className="block border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50"
                      onClick={() => setCareOpen(false)}
                    >
                      <span className="block text-sm font-semibold text-brand-800">The Wellness Hub</span>
                      <span className="text-xs text-slate-500">Centralized destination for all care services</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/manual"
                      className="block border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50"
                      onClick={() => setCareOpen(false)}
                    >
                      <span className="block text-sm font-semibold text-slate-900">Digital Manual</span>
                      <span className="text-xs text-slate-500">Clinical & natural first-aid guides</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/consultation"
                      className="block border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50"
                      onClick={() => setCareOpen(false)}
                    >
                      <span className="block text-sm font-semibold text-slate-900">Consultation</span>
                      <span className="text-xs text-slate-500">Licensed health practitioners</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/spiritual-guidance"
                      className="block border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-slate-50"
                      onClick={() => setCareOpen(false)}
                    >
                      <span className="block text-sm font-semibold text-slate-900">Spiritual guidance</span>
                      <span className="text-xs text-slate-500">Church of Pentecost pastoral care</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <NavLink to="/about" className={navClass} onClick={() => { setShopOpen(false); setCareOpen(false); }}>
            About
          </NavLink>
          <NavLink to="/membership" className={navClass} onClick={() => { setShopOpen(false); setCareOpen(false); }}>
            Membership
          </NavLink>
          <NavLink to="/contact" className={navClass} onClick={() => { setShopOpen(false); setCareOpen(false); }}>
            Contact
          </NavLink>
          <NavLink to="/tracking" className={navClass} onClick={() => { setShopOpen(false); setCareOpen(false); }}>
            Track & Orders
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
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className={`px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-slate-50`}
                >
                  Admin Portal
                </Link>
              )}
              {useAuth().isSubscriber && (
                <span className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
                  <span className="h-1.5 w-1.5 bg-amber-500" />
                  Premium
                </span>
              )}
              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
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
              {isAdmin && (
                <Link
                  to="/admin/orders"
                  className="p-2 text-slate-700 hover:text-brand-700"
                  aria-label="Admin Portal"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
                className="p-2 text-slate-700 hover:text-brand-700"
                aria-label="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 pr-1 border-r border-slate-300">
              <Link to="/login" className="p-2 text-slate-700 hover:text-brand-700" aria-label="Login">
                <UserIcon className="h-5 w-5" />
              </Link>
              <Link to="/register" className="p-2 text-slate-700 hover:text-brand-700" aria-label="Sign up">
                <UserPlusIcon className="h-5 w-5" />
              </Link>
            </div>
          )}
          <Link
            to="/cart"
            className="group relative p-2 text-slate-700 hover:text-brand-700"
            aria-label="Cart"
          >
            <ShoppingCartIcon className="h-5 w-5" />
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
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
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
              Care & Knowledge
            </p>
            <Link
              to="/wellness"
              className="px-3 py-2 pl-6 text-brand-700 font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              The Wellness Hub
            </Link>
            <Link
              to="/manual"
              className="px-3 py-2 pl-6 text-slate-700"
              onClick={() => setMobileOpen(false)}
            >
              Digital Manual
            </Link>
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
              Track & Orders
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
                {isAdmin && (
                  <Link
                    to="/admin/orders"
                    className="px-3 py-3 text-left text-brand-700 font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  type="button"
                  className="px-3 py-3 text-left text-slate-800"
                  onClick={() => {
                    setMobileOpen(false)
                    setLogoutModalOpen(true)
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

      {loggingOut && <LoadingOverlay message="Signing you out securely..." />}
      
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onConfirm={async () => {
          setLogoutModalOpen(false)
          setLoggingOut(true)
          // Simulate a small delay for realistic professional feel
          await new Promise(resolve => setTimeout(resolve, 1200))
          logout()
          setLoggingOut(false)
        }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </header>
  )
}
