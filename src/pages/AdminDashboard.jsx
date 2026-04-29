import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { InboxStackIcon, ArchiveBoxIcon, UsersIcon, ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { products as initialProducts } from '../data/products'
import { CTA_PRIMARY, CTA_SECONDARY } from '../config/brand'
import { apiFetch, getApiBase, getStoredToken } from '../lib/api'

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const [inventory, setInventory] = useState([])
  const [loadingInventory, setLoadingInventory] = useState(true)

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const [transactions, setTransactions] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', status: 'In Stock', image: null })

  useEffect(() => {
    if (activeTab === 'payments') {
      async function loadTransactions() {
        setLoadingTransactions(true)
        try {
          const res = await apiFetch('/api/admin/paystack/transactions')
          if (res.success) setTransactions(res.data || [])
        } catch (err) {
          console.error(err)
        } finally {
          setLoadingTransactions(false)
        }
      }
      loadTransactions()
    }
    
    if (activeTab === 'customers') {
      async function loadUsers() {
        setLoadingUsers(true)
        try {
          const res = await apiFetch('/api/users/all')
          if (res.success) setUsers(res.data || [])
        } catch (err) {
          console.error(err)
        } finally {
          setLoadingUsers(false)
        }
      }
      loadUsers()
    }
  }, [activeTab])
  // Load Orders from API
  useEffect(() => {
    async function loadOrders() {
      setLoadingOrders(true)
      try {
        const res = await apiFetch('/api/orders/all')
        if (res.success) {
          setOrders(res.data || [])
        } else {
          console.error('Failed to load orders:', res.message)
        }
      } catch (err) {
        console.error('API error:', err)
      } finally {
        setLoadingOrders(false)
      }
    }
    loadOrders()
  }, [])

  // Load Inventory from API
  useEffect(() => {
    async function loadInventory() {
      setLoadingInventory(true)
      try {
        const res = await apiFetch('/api/products?active=all')
        if (res.success) {
          setInventory(res.data)
        } else {
          console.error('Failed to load inventory:', res.message)
        }
      } catch (err) {
        console.error('API error:', err)
      } finally {
        setLoadingInventory(false)
      }
    }
    loadInventory()
  }, [])

  // Listen for real-time orders globally
  useEffect(() => {
    const handleOrderPlaced = () => {
      // Refresh orders when a new one is placed
      apiFetch('/api/orders/all').then(res => {
        if (res.success) setOrders(res.data || [])
      }).catch(console.error)
    }
    window.addEventListener('order_placed', handleOrderPlaced)
    return () => {
      window.removeEventListener('order_placed', handleOrderPlaced)
    }
  }, [])

  const formatCurrency = (cents) => (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  const isSubscriptionOrder = (order) => {
    if (!order.items) return false
    return order.items.some(item => 
      item.name.toLowerCase().includes('subscription') || 
      item.name.toLowerCase().includes('plan') || 
      item.name.toLowerCase().includes('membership')
    )
  }

  const updateStatus = async (id, newStatus) => {
    // Optimistic update
    const previous = orders.map(o => ({ ...o }))
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus.toLowerCase() } : o))
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus.toLowerCase() })
    }
    
    try {
      const res = await apiFetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus.toLowerCase() })
      })
      if (!res.success) throw new Error(res.message)
    } catch (err) {
      console.error(err)
      setOrders(previous)
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(previous.find(o => o.id === id))
      }
      alert('Failed to update order status.')
    }
  }

  const updateProductStatus = async (id, status) => {
    const previous = inventory.map(p => ({ ...p }))
    setInventory(inventory.map(p => p.id === id ? { ...p, status } : p))
    try {
      const res = await apiFetch(`/api/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      if (!res.success) {
        throw new Error('Update failed')
      }
    } catch (err) {
      console.error(err)
      setInventory(previous)
      alert('Failed to update product status.')
    }
  }

  const updateUserRole = async (id, newRole) => {
    const previous = users.map(u => ({ ...u }))
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    try {
      const res = await apiFetch(`/api/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      })
      if (!res.success) throw new Error(res.message)
    } catch (err) {
      console.error(err)
      setUsers(previous)
      alert(err.message || 'Failed to update user role.')
    }
  }

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const previous = inventory.map(p => ({ ...p }))
      setInventory(inventory.filter(p => p.id !== id))
      try {
        const res = await apiFetch(`/api/products/${id}`, {
          method: 'DELETE'
        })
        if (!res.success) {
          throw new Error('Delete failed')
        }
      } catch (err) {
        console.error(err)
        setInventory(previous)
        alert('Failed to delete product.')
      }
    }
  }

  const addProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) return
    const priceCents = Math.round(parseFloat(newProduct.price) * 100)
    
    // Generate a quick slug
    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)

    try {
      let imageUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'

      // If there's an image file, upload it first
      if (newProduct.imageFile) {
        const formData = new FormData()
        formData.append('image', newProduct.imageFile)
        
        const uploadRes = await fetch(`${getApiBase()}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getStoredToken()}`
          },
          body: formData
        })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      }

      const res = await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          name: newProduct.name,
          slug,
          priceCents,
          image: imageUrl,
          active: true,
          status: newProduct.status || 'In Stock'
        })
      })
      if (res.success) {
        // Refresh inventory
        const invRes = await apiFetch('/api/products?active=all')
        if (invRes.success) {
          setInventory(invRes.data)
        }
        setNewProduct({ name: '', price: '', category: '', status: 'In Stock', image: null, imageFile: null })
        alert('Product created successfully!')
      } else {
        alert(res.message || 'Failed to create product.')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to create product.')
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewProduct({ ...newProduct, imageFile: file, image: URL.createObjectURL(file) })
    }
  }

  const statusColors = {
    'pending': 'bg-amber-100 text-amber-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'paid': 'bg-blue-100 text-blue-800',
  }

  const stockStatusColors = {
    'In Stock': 'bg-green-100 text-green-800',
    'Out of Stock': 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <style>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          /* Show only the receipt and its children */
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          /* Position the receipt at the top left of the printed page */
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Hide the print button itself and other interactive elements within the receipt */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-300 md:shrink-0 flex flex-col no-print">
        <div className="p-6">
          <h2 className="text-xl font-display text-white tracking-wide">SysAdmin</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Management Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition font-medium ${activeTab === 'orders' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <InboxStackIcon className="w-5 h-5" />
              <span>Orders</span>
            </div>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('inventory'); setSelectedOrder(null); }}
            className={`w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md transition font-medium ${activeTab === 'inventory' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
             <ArchiveBoxIcon className="w-5 h-5" />
             <span>Inventory</span>
          </button>
          <button 
            onClick={() => { setActiveTab('customers'); setSelectedOrder(null); }}
            className={`w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md transition font-medium ${activeTab === 'customers' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
             <UsersIcon className="w-5 h-5" />
             <span>Customers</span>
          </button>
          <button 
            onClick={() => { setActiveTab('analytics'); setSelectedOrder(null); }}
            className={`w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md transition font-medium ${activeTab === 'analytics' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
             <ChartBarIcon className="w-5 h-5" />
             <span>Analytics</span>
          </button>
          <button 
            onClick={() => { setActiveTab('payments'); setSelectedOrder(null); }}
            className={`w-full flex items-center justify-start gap-3 px-3 py-2 rounded-md transition font-medium ${activeTab === 'payments' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
             <ChartBarIcon className="w-5 h-5" />
             <span>Payments</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/shop" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {activeTab === 'analytics' && (
          <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-display text-slate-900">Real-time Analytics</h1>
            <p className="text-sm text-slate-600 mt-1 mb-8">Live overview of your platform's operational metrics.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-slate-200 shadow-sm p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  GH₵ {formatCurrency(orders.filter(o => o.status === 'paid' || o.status === 'completed' || o.status === 'shipped' || o.status === 'delivered').reduce((sum, o) => sum + o.totalCents, 0))}
                </p>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{orders.length}</p>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Customers</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{new Set(orders.map(o => o.user.email)).size}</p>
              </div>
            </div>

            <h2 className="text-lg font-display text-slate-900 mb-4">Recent Activity Log</h2>
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(o => (
                  <li key={o.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Order #{o.id} placed by {o.user.email}</p>
                      <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </li>
                ))}
                {orders.length === 0 && (
                  <li className="p-8 text-center text-slate-500 text-sm">No recent activity detected.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-display text-slate-900">Payment Transactions</h1>
            <p className="text-sm text-slate-600 mt-1 mb-8">Real-time financial activity from Paystack.</p>
            <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loadingTransactions ? (
                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">Loading transactions...</td></tr>
                  ) : transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{tx.reference}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {tx.currency} {(tx.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{tx.customer.email}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(tx.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-display text-slate-900">User Management</h1>
            <p className="text-sm text-slate-600 mt-1 mb-8">View and manage all registered accounts and assign admin privileges.</p>
            <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Orders</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loadingUsers ? (
                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">Loading users...</td></tr>
                  ) : users.map((user) => {
                     const userOrdersCount = orders.filter(o => o.user.email === user.email).length;
                     const fullName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email
                     return (
                        <tr key={user.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-medium text-slate-900">{fullName}</td>
                          <td className="px-6 py-4 text-slate-500">{user.email}</td>
                          <td className="px-6 py-4 text-center font-semibold text-slate-700">{userOrdersCount}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <select 
                              value={user.role || 'user'}
                              onChange={(e) => updateUserRole(user.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider outline-none border-none cursor-pointer ${
                                user.role === 'admin' 
                                  ? 'bg-brand-100 text-brand-800' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                     )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="p-4 sm:p-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display text-slate-900">Inventory Management</h1>
                <p className="text-sm text-slate-600 mt-1">Add, remove, and update product availability for clients.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product List */}
              <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Price (GH₵)</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {inventory.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.category}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select 
                            value={product.status || 'In Stock'}
                            onChange={(e) => updateProductStatus(product.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none border-none ${stockStatusColors[product.status || 'In Stock']}`}
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          {(product.priceCents / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 font-medium hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Product Form */}
              <div className="bg-white border border-slate-200 shadow-sm p-6 h-fit">
                <h3 className="font-display text-xl text-slate-900 mb-6">Add New Product</h3>
                <form onSubmit={addProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Name</label>
                    <input 
                      type="text" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (GH₵)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Medical kit">Medical kit</option>
                      <option value="Supplement">Supplement</option>
                      <option value="Wellness">Wellness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-slate-300 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {newProduct.image && (
                      <div className="mt-2 h-20 w-20 overflow-hidden border border-slate-200">
                        <img src={newProduct.image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className={`w-full py-3 text-sm font-bold uppercase tracking-widest ${CTA_PRIMARY}`}
                  >
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          selectedOrder ? (
            <div className="p-4 sm:p-8 max-w-4xl mx-auto">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-brand-700 hover:underline mb-6 text-sm font-semibold no-print"
              >
                &larr; Back to Order List
              </button>

              <div id="printable-receipt" className="bg-white border border-slate-200 shadow-sm p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
                  <div>
                    <h1 className="text-2xl font-display text-slate-900">Receipt / Packing Slip</h1>
                    <p className="text-slate-500 mt-1">Order ID: {selectedOrder.id}</p>
                    <p className="text-slate-500 text-sm">Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                    {isSubscriptionOrder(selectedOrder) && (
                      <span className="ml-2 inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
                        Subscription
                      </span>
                    )}
                    <div className="mt-4 flex flex-col gap-2 no-print">
                      {(selectedOrder.status === 'pending' || selectedOrder.status === 'paid') && (
                        <button onClick={() => updateStatus(selectedOrder.id, 'shipped')} className={`text-xs ${CTA_PRIMARY} py-1.5 px-4`}>
                          Mark as Shipped
                        </button>
                      )}
                      {selectedOrder.status === 'shipped' && (
                        <button onClick={() => updateStatus(selectedOrder.id, 'delivered')} className={`text-xs ${CTA_PRIMARY} py-1.5 px-4`}>
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Customer & Shipping</h3>
                    <p className="font-semibold text-slate-900">{`${selectedOrder.user.profile?.firstName || ''} ${selectedOrder.user.profile?.lastName || ''}`.trim() || selectedOrder.user.email}</p>
                    <p className="text-slate-600 mt-2 whitespace-pre-wrap">{[
                      selectedOrder.shippingSnapshot?.line1, 
                      selectedOrder.shippingSnapshot?.city, 
                      selectedOrder.shippingSnapshot?.state, 
                      selectedOrder.shippingSnapshot?.country
                    ].filter(Boolean).join(', ') || 'No Address Provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Contact & Payment</h3>
                    <p className="text-slate-700">{selectedOrder.user.email}</p>
                    <p className="text-slate-700">{selectedOrder.user.profile?.phone || 'N/A'}</p>
                    <p className="mt-3 font-medium text-slate-900">Payment: {selectedOrder.shippingSnapshot?.method || 'Card via Paystack'}</p>
                  </div>
                </div>

                <div className="py-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Line Items</h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-600">
                        <th className="py-2 font-medium">Item</th>
                        <th className="py-2 font-medium text-right">Qty</th>
                        <th className="py-2 font-medium text-right">Unit Price</th>
                        <th className="py-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="text-sm text-slate-800">
                          <td className="py-3 pr-2 font-medium">{item.name}</td>
                          <td className="py-3 px-2 text-right">{item.quantity.toLocaleString()}</td>
                          <td className="py-3 px-2 text-right">GH₵ {formatCurrency(item.unitPriceCents)}</td>
                          <td className="py-3 pl-2 text-right font-semibold text-slate-900">GH₵ {formatCurrency(item.quantity * item.unitPriceCents)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-800 font-bold text-slate-900 text-lg">
                        <td colSpan="3" className="py-4 text-right pr-4">Grand Total</td>
                        <td className="py-4 text-right">GH₵ {formatCurrency(selectedOrder.totalCents)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 text-center text-sm text-slate-500 no-print">
                  <p>This is a formal packing slip for bulk distribution logistics.</p>
                  <button className="mt-2 text-brand-700 font-semibold underline" onClick={() => window.print()}>
                    Print Receipt / Packing Slip
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-8">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display text-slate-900">Incoming Orders</h1>
                  <p className="text-sm text-slate-600 mt-1">Manage bulk shipments, customer fulfillment, and receipts.</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="px-4 py-2 border border-slate-300 text-sm focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4 text-right">Total (GH₵)</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {loadingOrders ? (
                      <tr><td colSpan="6" className="py-8 text-center text-slate-500">Loading orders...</td></tr>
                    ) : orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => {
                      const fullName = `${order.user.profile?.firstName || ''} ${order.user.profile?.lastName || ''}`.trim() || order.user.email
                      return (
                      <tr key={order.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{fullName}</p>
                          <p className="text-xs text-slate-500">{order.user.email}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          {formatCurrency(order.totalCents)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                            {isSubscriptionOrder(order) && (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                                Subscription
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="text-brand-700 font-medium hover:underline"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
