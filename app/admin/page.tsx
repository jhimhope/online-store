'use client'
import { useState, useEffect } from 'react'
import { Package, TrendingUp, ShoppingCart, AlertTriangle, Pencil, Trash2, Plus, X, ShieldX } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

const EMPTY_PRODUCT = { name: '', description: '', price: '', image_url: '', category: 'Electronics', stock_quantity: '' }
const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Fitness', 'Sports', 'Books', 'Beauty']

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!user) { setLoading(false); return }

    // Set admin to true for any logged-in user
    setIsAdmin(true)

    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
    ]).then(([s, o, p, u]) => {
      setStats(s)
      setOrders(o.orders || [])
      setProducts(p.products || [])
      setUsers(u.users || [])
      setLoading(false)
    })
  }, [user])

  async function updateOrderStatus(orderId: string, status: string) {
    setUpdatingOrder(orderId)
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    setUpdatingOrder(null)
  }

  function openAddModal() {
    setEditingProduct(null)
    setProductForm({ ...EMPTY_PRODUCT })
    setFormError('')
    setShowModal(true)
  }

  function openEditModal(product: any) {
    setEditingProduct(product)
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      image_url: product.image_url || '',
      category: product.category || 'Electronics',
      stock_quantity: product.stock_quantity?.toString() || '',
    })
    setFormError('')
    setShowModal(true)
  }

  async function handleSaveProduct() {
    if (!productForm.name || !productForm.price || !productForm.stock_quantity) {
      setFormError('Name, price, and stock quantity are required.')
      return
    }
    setSaving(true)
    setFormError('')
    const body = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock_quantity: parseInt(productForm.stock_quantity),
      ...(editingProduct ? { id: editingProduct.id } : {}),
    }
    const res = await fetch('/api/admin/products', {
      method: editingProduct ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setFormError(data.error || 'Failed to save product.')
      setSaving(false)
      return
    }
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p))
    } else {
      setProducts(prev => [data.product, ...prev])
    }
    setSaving(false)
    setShowModal(false)
  }

  async function handleDeleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getStockColor(qty: number) {
    if (qty === 0) return 'text-red-600 font-bold'
    if (qty <= 5) return 'text-orange-500 font-semibold'
    if (qty <= 20) return 'text-yellow-600'
    return 'text-green-600'
  }

  // --- Conditional returns AFTER all hooks ---

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
          <p className="text-gray-700 mb-4">You must be logged in to view the admin dashboard.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium">Sign In</Link>
        </div>
      </div>
    )
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Verifying admin access...</p>
      </div>
    )
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldX className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-700 mb-4">You don&apos;t have permission to access the admin dashboard.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium">Back to Store</Link>
        </div>
      </div>
    )
  }

  const tabs = ['overview', 'orders', 'products', 'inventory', 'sales report', 'users']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Store</Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* OVERVIEW TAB */}
        {!loading && activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4">
                <TrendingUp className="text-green-500 w-8 h-8" />
                <div>
                  <p className="text-sm text-gray-700">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₱{Number(stats?.total_revenue ?? 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4">
                <ShoppingCart className="text-blue-500 w-8 h-8" />
                <div>
                  <p className="text-sm text-gray-700">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_orders ?? 0}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4">
                <Package className="text-purple-500 w-8 h-8" />
                <div>
                  <p className="text-sm text-gray-700">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm flex items-center gap-4">
                <AlertTriangle className="text-orange-500 w-8 h-8" />
                <div>
                  <p className="text-sm text-gray-700">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.stock_quantity <= 5).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                  <div key={status} className={`rounded-lg p-3 text-center ${getStatusColor(status)}`}>
                    <p className="text-xl font-bold">{orders.filter(o => o.status === status).length}</p>
                    <p className="text-xs capitalize">{status}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-2">
                {[['card', 'Card'], ['cod', 'Cash on Delivery'], ['gcash', 'GCash']].map(([method, label]) => (
                  <div key={method} className="flex items-center justify-between">
                    <span className="text-gray-700">{label}</span>
                    <span className="font-semibold text-gray-900">{orders.filter(o => o.payment_method === method).length} orders</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-700">Product</th>
                    <th className="text-left py-2 text-gray-700">Category</th>
                    <th className="text-right py-2 text-gray-700">Price</th>
                    <th className="text-right py-2 text-gray-700">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map(p => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 text-gray-900">{p.name}</td>
                      <td className="py-2 text-gray-700">{p.category}</td>
                      <td className="py-2 text-right text-gray-900">₱{Number(p.price).toLocaleString()}</td>
                      <td className={`py-2 text-right ${getStockColor(p.stock_quantity)}`}>{p.stock_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {!loading && activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-700">Order #</th>
                    <th className="text-left px-4 py-3 text-gray-700">Customer</th>
                    <th className="text-left px-4 py-3 text-gray-700">Date</th>
                    <th className="text-left px-4 py-3 text-gray-700">Payment</th>
                    <th className="text-right px-4 py-3 text-gray-700">Total</th>
                    <th className="text-left px-4 py-3 text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-mono text-xs">{order.order_number || order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-gray-700">{order.customer_name || order.customer_email || '—'}</td>
                      <td className="px-4 py-3 text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{order.payment_method || '—'}</td>
                      <td className="px-4 py-3 text-right text-gray-900">₱{Number(order.total_amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={updatingOrder === order.id}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs rounded px-2 py-1 border-0 font-medium cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-700">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {!loading && activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-700">Product</th>
                    <th className="text-left px-4 py-3 text-gray-700">Category</th>
                    <th className="text-right px-4 py-3 text-gray-700">Price</th>
                    <th className="text-right px-4 py-3 text-gray-700">Stock</th>
                    <th className="text-right px-4 py-3 text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.image_url && <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded object-cover" />}
                          <span className="text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.category}</td>
                      <td className="px-4 py-3 text-right text-gray-900">₱{Number(p.price).toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right ${getStockColor(p.stock_quantity)}`}>{p.stock_quantity}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-800 mr-3" title="Edit">
                          <Pencil className="w-4 h-4 inline" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-500 hover:text-red-700" title="Delete">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-700">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {!loading && activeTab === 'inventory' && (
          <div className="space-y-4">
            {products.filter(p => p.stock_quantity <= 20).length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-2">
                <AlertTriangle className="text-orange-500 w-5 h-5 flex-shrink-0" />
                <p className="text-orange-700 text-sm">
                  {products.filter(p => p.stock_quantity === 0).length} out of stock,{' '}
                  {products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length} critically low,{' '}
                  {products.filter(p => p.stock_quantity > 5 && p.stock_quantity <= 20).length} low on stock.
                </p>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-700">Product</th>
                      <th className="text-left px-4 py-3 text-gray-700">Category</th>
                      <th className="text-right px-4 py-3 text-gray-700">Stock</th>
                      <th className="text-left px-4 py-3 text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .slice()
                      .sort((a, b) => a.stock_quantity - b.stock_quantity)
                      .map(p => (
                        <tr key={p.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{p.name}</td>
                          <td className="px-4 py-3 text-gray-700">{p.category}</td>
                          <td className={`px-4 py-3 text-right ${getStockColor(p.stock_quantity)}`}>{p.stock_quantity}</td>
                          <td className="px-4 py-3">
                            {p.stock_quantity === 0 ? (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Out of Stock</span>
                            ) : p.stock_quantity <= 5 ? (
                              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Critical</span>
                            ) : p.stock_quantity <= 20 ? (
                              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Low</span>
                            ) : (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">In Stock</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    {products.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-700">No inventory data.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SALES REPORT TAB */}
        {!loading && activeTab === 'sales report' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-700">Month</th>
                      <th className="text-right px-4 py-3 text-gray-700">Orders</th>
                      <th className="text-right px-4 py-3 text-gray-700">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const months: Record<string, { orders: number; revenue: number }> = {}
                      orders.forEach(o => {
                        const m = new Date(o.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })
                        if (!months[m]) months[m] = { orders: 0, revenue: 0 }
                        months[m].orders++
                        months[m].revenue += Number(o.total_amount)
                      })
                      const entries = Object.entries(months)
                      if (entries.length === 0) {
                        return <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-700">No sales data yet.</td></tr>
                      }
                      return entries.map(([month, data]) => (
                        <tr key={month} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{month}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{data.orders}</td>
                          <td className="px-4 py-3 text-right text-gray-900 font-semibold">₱{data.revenue.toLocaleString()}</td>
                        </tr>
                      ))
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Product Sales Report</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-700">Product</th>
                      <th className="text-left px-4 py-3 text-gray-700">Category</th>
                      <th className="text-right px-4 py-3 text-gray-700">Unit Price</th>
                      <th className="text-right px-4 py-3 text-gray-700">Current Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 text-gray-700">{p.category}</td>
                        <td className="px-4 py-3 text-right text-gray-900">₱{Number(p.price).toLocaleString()}</td>
                        <td className={`px-4 py-3 text-right ${getStockColor(p.stock_quantity)}`}>{p.stock_quantity}</td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-700">No products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {!loading && activeTab === 'users' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <p className="text-sm text-gray-700">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <p className="text-sm text-gray-700">Admins</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <p className="text-sm text-gray-700">Supervisors</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{users.filter(u => u.role === 'supervisor').length}</p>
              </div>
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <p className="text-sm text-gray-700">Regular Users</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">{users.filter(u => u.role === 'user').length}</p>
              </div>
            </div>

            {/* Users Table with Role Management */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">User Management ({users.length})</h2>
                <p className="text-sm text-gray-500 mt-1">Assign roles: Admin (full access), Supervisor (view & print orders), User (customer)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-700">Email</th>
                      <th className="text-left px-4 py-3 text-gray-700">Joined</th>
                      <th className="text-center px-4 py-3 text-gray-700">Account</th>
                      <th className="text-right px-4 py-3 text-gray-700">Orders</th>
                      <th className="text-right px-4 py-3 text-gray-700">Spent</th>
                      <th className="text-center px-4 py-3 text-gray-700">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-700">No users found.</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-gray-900 font-medium">{u.email}</p>
                            <p className="text-gray-500 text-xs">{u.last_sign_in ? `Last login: ${new Date(u.last_sign_in).toLocaleDateString()}` : 'Never logged in'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-center">
                          {u.confirmed ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Confirmed</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">{u.total_orders ?? 0}</td>
                        <td className="px-4 py-3 text-right text-gray-900">₱{Number(u.total_spent ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={u.role || 'user'}
                            onChange={async (e) => {
                              const newRole = e.target.value
                              const res = await fetch('/api/admin/roles', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ user_id: u.id, email: u.email, role: newRole })
                              })
                              if (res.ok) {
                                setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr))
                              }
                            }}
                            className={`text-xs rounded-full px-3 py-1 font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              u.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Role Legend */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Role Permissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="font-medium text-purple-800 mb-1">👑 Admin</p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>✓ Full dashboard access</li>
                    <li>✓ Manage products</li>
                    <li>✓ View all reports</li>
                    <li>✓ Manage users & roles</li>
                    <li>✓ View & print orders</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="font-medium text-blue-800 mb-1">🔵 Supervisor</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>✓ View & print orders</li>
                    <li>✓ Search & filter orders</li>
                    <li>✗ Cannot manage products</li>
                    <li>✗ Cannot view reports</li>
                    <li>✗ Cannot manage users</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-800 mb-1">👤 User</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>✓ Browse products</li>
                    <li>✓ Place orders</li>
                    <li>✓ View own orders</li>
                    <li>✗ No backend access</li>
                    <li>✗ No admin access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {formError && <p className="text-red-600 text-sm bg-red-50 rounded p-3">{formError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={e => setProductForm(f => ({ ...f, stock_quantity: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={productForm.category}
                  onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image_url}
                  onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={saving}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
