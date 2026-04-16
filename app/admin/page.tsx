'use client'

import { useState, useEffect } from 'react'
import { Package, Users, TrendingUp, ShoppingCart, AlertTriangle, BarChart2, ClipboardList, Archive } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/orders')
        ])
        const statsData = await statsRes.json()
        const ordersData = await ordersRes.json()
        setStats(statsData)
        setOrders(ordersData.orders || [])
      } catch (err) {
        console.error('Error fetching admin data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrder(orderId)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status })
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      }
    } finally {
      setUpdatingOrder(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockColor = (qty: number) => {
    if (qty === 0) return 'text-red-600 font-bold'
    if (qty <= 5) return 'text-orange-600 font-bold'
    return 'text-green-600'
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
        <Link href="/login" className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700">
          Sign In
        </Link>
      </div>
    )
  }

  const tabs = ['overview', 'orders', 'inventory', 'sales report']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Welcome, {user.email}</p>
          </div>
          <Link href="/" className="text-sm text-primary-600 hover:text-primary-700">← Back to Store</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && stats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">₱{stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <div className="bg-green-500 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                      </div>
                      <div className="bg-blue-500 p-3 rounded-full">
                        <ShoppingCart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                      </div>
                      <div className="bg-purple-500 p-3 rounded-full">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Low Stock Items</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.lowStockProducts.length}</p>
                      </div>
                      <div className="bg-orange-500 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Orders by Status */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Orders by Status</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.ordersByStatus).map(([status, count]: any) => (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.paymentBreakdown).map(([method, count]: any) => (
                        <div key={method} className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">
                            {method === 'cod' ? 'Cash on Delivery' : method === 'card' ? 'Credit Card' : 'PayPal'}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Selling Products */}
                  <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
                    {stats.topProducts.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No sales data yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 text-sm font-medium text-gray-600">Product</th>
                              <th className="text-right py-2 text-sm font-medium text-gray-600">Units Sold</th>
                              <th className="text-right py-2 text-sm font-medium text-gray-600">Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.topProducts.map((p: any, i: number) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-3 text-sm text-gray-900">{p.name}</td>
                                <td className="py-3 text-sm text-gray-900 text-right">{p.quantity}</td>
                                <td className="py-3 text-sm font-medium text-gray-900 text-right">₱{p.revenue.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">All Orders ({orders.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Update</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No orders yet</td>
                        </tr>
                      ) : orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.order_number}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{order.shipping_first_name} {order.shipping_last_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.payment_method === 'cod' ? 'COD' : order.payment_method === 'card' ? 'Card' : 'PayPal'}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">₱{Number(order.total_amount).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              disabled={updatingOrder === order.id}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== INVENTORY TAB ===== */}
            {activeTab === 'inventory' && stats && (
              <>
                {/* Alerts */}
                {stats.outOfStockProducts.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 font-medium">
                      {stats.outOfStockProducts.length} product(s) are out of stock!
                    </p>
                  </div>
                )}
                {stats.lowStockProducts.length > 0 && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    <p className="text-orange-700 font-medium">
                      {stats.lowStockProducts.length} product(s) have low stock (5 or less)
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">Inventory ({stats.inventory.length} products)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.inventory.map((product: any) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{product.category}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">₱{Number(product.price).toFixed(2)}</td>
                            <td className={`px-4 py-3 text-sm ${getStockColor(product.stock_quantity)}`}>
                              {product.stock_quantity}
                            </td>
                            <td className="px-4 py-3">
                              {product.stock_quantity === 0 ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>
                              ) : product.stock_quantity <= 5 ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Low Stock</span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              ₱{(Number(product.price) * product.stock_quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-sm font-bold text-gray-900">Total Inventory Value</td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">
                            ₱{stats.inventory.reduce((sum: number, p: any) => sum + (Number(p.price) * p.stock_quantity), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ===== SALES REPORT TAB ===== */}
            {activeTab === 'sales report' && stats && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">₱{stats.totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalOrders}</p>
                    <p className="text-sm text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-sm text-gray-600">Average Order Value</p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">
                      ₱{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Per order</p>
                  </div>
                </div>

                {/* Monthly Revenue Table */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue (Last 6 Months)</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Month</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-600">Orders</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-600">Revenue</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 pl-4">Chart</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.monthlyRevenue.map((m: any, i: number) => {
                          const maxRevenue = Math.max(...stats.monthlyRevenue.map((x: any) => x.revenue), 1)
                          return (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-3 text-sm font-medium text-gray-900">{m.month}</td>
                              <td className="py-3 text-sm text-gray-900 text-right">{m.orders}</td>
                              <td className="py-3 text-sm font-medium text-gray-900 text-right">₱{m.revenue.toFixed(2)}</td>
                              <td className="py-3 pl-4">
                                <div className="w-48 bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-primary-600 h-3 rounded-full"
                                    style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Products Sales */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Sales Report</h3>
                  {stats.topProducts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No sales data yet. Place some orders to see the report.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-sm font-medium text-gray-600">Product</th>
                            <th className="text-right py-2 text-sm font-medium text-gray-600">Units Sold</th>
                            <th className="text-right py-2 text-sm font-medium text-gray-600">Revenue</th>
                            <th className="text-left py-2 text-sm font-medium text-gray-600 pl-4">Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.topProducts.map((p: any, i: number) => {
                            const totalRevenue = stats.topProducts.reduce((s: number, x: any) => s + x.revenue, 0)
                            return (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-3 text-sm text-gray-900">{p.name}</td>
                                <td className="py-3 text-sm text-gray-900 text-right">{p.quantity}</td>
                                <td className="py-3 text-sm font-medium text-gray-900 text-right">₱{p.revenue.toFixed(2)}</td>
                                <td className="py-3 pl-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-600">
                                      {totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
