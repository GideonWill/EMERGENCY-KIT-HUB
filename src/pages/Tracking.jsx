import { useState, useEffect } from 'react'
import { COMPANY_NAME_SHORT, CTA_PRIMARY } from '../config/brand'
import { useAuth } from '../context/AuthContext'

const MOCK_ORDER_DATA = {
  id: 'ORD-8Y29X-11M',
  date: 'Oct 04, 2026',
  expectedDelivery: 'Oct 08, 2026',
  items: [
    { name: 'Comprehensive Family Emergency Kit', quantity: 1, price: 199.0 },
    { name: 'Daily Wellness Supplement', quantity: 2, price: 29.0 },
  ],
  statusIndex: 2, // 0: Placed, 1: Processing, 2: Shipped, 3: Delivered
}

const STATUSES = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

export default function Tracking() {
  const { user, isAuthenticated } = useAuth()
  const [orderId, setOrderId] = useState('')
  const [trackedOrder, setTrackedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [myOrders, setMyOrders] = useState([])

  const getStatusIndex = (status) => {
    if (status === 'Pending') return 0
    if (status === 'Processing') return 1
    if (status === 'Shipped') return 2
    if (status === 'Delivered') return 3
    return 0
  }

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const saved = localStorage.getItem('admin_orders')
      if (saved) {
        const allOrders = JSON.parse(saved)
        setMyOrders(allOrders.filter(o => o.customer?.email === user.email))
      }
    }
  }, [isAuthenticated, user])

  const performSearch = (searchId) => {
    if (!searchId.trim()) return
    setLoading(true)
    setError('')
    
    setTimeout(() => {
      setLoading(false)
      const savedData = localStorage.getItem('admin_orders')
      let foundLocal = null
      if (savedData) {
        const allOrders = JSON.parse(savedData)
        foundLocal = allOrders.find(o => o.id === searchId.trim().toUpperCase())
      }

      if (foundLocal) {
        setTrackedOrder({
          id: foundLocal.id,
          date: new Date(foundLocal.date).toLocaleDateString(),
          expectedDelivery: 'Expected in 3-5 days',
          items: foundLocal.items.map(i => ({ name: i.name, quantity: i.qty, price: i.price })),
          statusIndex: getStatusIndex(foundLocal.status)
        })
      } else if (searchId.trim().toUpperCase() === MOCK_ORDER_DATA.id || searchId.trim() === 'demo') {
        setTrackedOrder(MOCK_ORDER_DATA)
      } else {
        setError('Order not found. Please double-check your Order ID.')
        setTrackedOrder(null)
      }
    }, 800)
  }

  const handleTrack = (e) => {
    e.preventDefault()
    performSearch(orderId)
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-slate-50 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 right-0 h-96 bg-brand-900 z-0"></div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-white sm:text-4xl">Track Your Order</h1>
          <p className="mt-4 text-brand-100 max-w-xl mx-auto">
            Stay updated on your {COMPANY_NAME_SHORT} order's journey from our warehouse to your front door.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md shadow-2xl shadow-slate-200/50 rounded-2xl p-6 sm:p-10">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="order-id" className="sr-only">Order ID</label>
            <input
              id="order-id"
              type="text"
              placeholder="Enter your Order ID (e.g. ORD-80123)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-5 py-4 text-slate-900 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-slate-300 bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className={`px-8 py-4 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all duration-200 ${CTA_PRIMARY} shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 whitespace-nowrap`}
            >
              {loading ? 'Locating…' : 'Track Order'}
            </button>
          </form>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm" role="alert">
              <p className="flex items-center gap-2">
                <span className="text-red-500 text-lg">⚠</span> {error}
              </p>
            </div>
          )}

          {trackedOrder && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Order #{trackedOrder.id}</h2>
                  <p className="text-sm text-slate-500 mt-1">Placed on {trackedOrder.date}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <p className="text-sm text-slate-500">Expected Delivery</p>
                  <p className="text-lg font-semibold text-brand-700">{trackedOrder.expectedDelivery}</p>
                </div>
              </div>

              {/* Progress Tracker — Horizontal on Desktop, Vertical on Mobile */}
              <div className="relative my-12">
                {/* Horizontal Bar (Desktop) */}
                <div className="hidden sm:block absolute top-[18px] left-0 w-full h-1 bg-slate-100 z-0 overflow-hidden rounded-full">
                  <div
                    style={{ width: `${(trackedOrder.statusIndex / (STATUSES.length - 1)) * 100}%` }}
                    className="h-full bg-brand-600 transition-all duration-1000 ease-out"
                  ></div>
                </div>

                <div className="flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-0 relative z-10 w-full">
                  {STATUSES.map((status, index) => {
                    const isCompleted = index <= trackedOrder.statusIndex;
                    const isCurrent = index === trackedOrder.statusIndex;
                    
                    return (
                      <div key={status} className="flex items-center sm:flex-col sm:text-center group">
                        {/* Status Icon */}
                        <div className={`relative shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors duration-500 ${isCompleted ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          {isCompleted ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                          
                          {/* Vertical Connector Line (Mobile) — Only for non-last items */}
                          {index < STATUSES.length - 1 && (
                            <div className={`absolute top-10 left-1/2 -ml-[2px] w-1 h-8 sm:hidden ${index < trackedOrder.statusIndex ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                          )}
                        </div>

                        {/* Status Text */}
                        <div className="ml-4 sm:ml-0 sm:mt-4">
                          <p className={`text-base sm:text-xs md:text-sm font-bold uppercase tracking-tight ${isCurrent ? 'text-brand-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {status}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
                            {isCurrent ? 'Ongoing now' : isCompleted ? 'Step completed' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-12 bg-slate-50 rounded-xl p-6 border border-slate-100 overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 px-2">Items in this Package</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 font-semibold text-slate-600 px-2">Item</th>
                        <th className="pb-3 text-center font-semibold text-slate-600 px-2">Qty</th>
                        <th className="pb-3 text-right font-semibold text-slate-600 px-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {trackedOrder.items.map((item, idx) => (
                        <li key={idx} className="hidden" /> /* Compatibility for previous logic */
                      ))}
                      {trackedOrder.items.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-white transition-colors">
                          <td className="py-4 font-medium text-slate-900 px-2 min-w-[12rem]">{item.name}</td>
                          <td className="py-4 text-center text-slate-500 px-2">×{item.quantity}</td>
                          <td className="py-4 text-right font-semibold text-slate-900 px-2">GH₵{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {isAuthenticated && myOrders.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-display font-semibold text-slate-900">Your Recent Activity</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 animate-pulse">
                  {myOrders.length} {myOrders.length === 1 ? 'Order' : 'Orders'} found
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-slate-50/50 hover:bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <p className="font-bold text-slate-900 tracking-tight text-lg group-hover:text-brand-700 transition-colors">{order.id}</p>
                        <p className="text-xs text-slate-500 font-medium">{new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-black tracking-widest rounded-md border shadow-sm ${
                        order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-brand-50 text-brand-700 border-brand-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-6 flex-1">
                      {order.items.slice(0, 3).map((item, idx) => (
                         <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-600 truncate pr-4">{item.name}</span>
                            <span className="text-slate-400 font-mono">x{item.qty}</span>
                         </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">+ {order.items.length - 3} more items</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-auto pt-5 border-t border-slate-100">
                      <button 
                        onClick={() => {
                          setOrderId(order.id)
                          performSearch(order.id)
                          window.scrollTo({ top: 300, behavior: 'smooth' })
                        }} 
                        className="flex-1 py-3 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:text-brand-700 transition shadow-sm text-slate-700"
                      >
                        Track Details
                      </button>
                      {order.status === 'Pending' && (
                        <button onClick={() => {
                          if(window.confirm('Are you sure you want to cancel this order?')) {
                            const saved = JSON.parse(localStorage.getItem('admin_orders') || '[]')
                            const updated = saved.filter(o => o.id !== order.id)
                            localStorage.setItem('admin_orders', JSON.stringify(updated))
                            setMyOrders(updated.filter(o => o.customer?.email === user.email))
                            if (trackedOrder?.id === order.id) setTrackedOrder(null)
                            window.dispatchEvent(new Event('storage'))
                          }
                        }} className="flex-1 py-3 text-xs font-bold bg-white text-red-600 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition shadow-sm">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
