'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Printer, Search } from 'lucide-react'
import Link from 'next/link'

export default function StaffPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    // Check role
    fetch('/api/user/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    }).then(r => r.json()).then(d => {
      setUserRole(d.role || 'user')
      if (d.role === 'admin' || d.role === 'supervisor') {
        fetch('/api/admin/orders')
          .then(r => r.json())
          .then(data => {
            setOrders(data.orders || [])
            setFiltered(data.orders || [])
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })
  }, [user])

  useEffect(() => {
    let result = [...orders]
    if (search) {
      result = result.filter(o =>
        o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping_first_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping_last_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping_email?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter)
    }
    setFiltered(result)
  }, [search, statusFilter, orders])

  const viewOrder = async (order: any) => {
    setSelectedOrder(order)
    const res = await fetch(`/api/orders/${order.id}`)
    const data = await res.json()
    setOrderItems(data.items || [])
  }

  const printOrder = () => {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html>
        <head>
          <title>Order ${selectedOrder?.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            .subtitle { color: #666; font-size: 13px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background: #f3f4f6; text-align: left; padding: 8px; font-size: 13px; }
            td { padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
            .total { font-weight: bold; font-size: 15px; }
            .section { margin-bottom: 16px; }
            .label { font-weight: bold; font-size: 13px; }
            .value { font-size: 13px; color: #374151; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>window.onload = () => window.print()</script>
        </body>
      </html>
    `)
    win.document.close()
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <Link href="/login" className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700">Sign In</Link>
        </div>
      </div>
    )
  }

  if (userRole !== null && userRole !== 'admin' && userRole !== 'supervisor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
          <Link href="/" className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700">Back to Store</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-600">View and print customer orders</p>
          </div>
          <Link href="/" className="text-sm text-primary-600 hover:underline">← Back to Store</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, name, or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold text-gray-900">Orders ({filtered.length})</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading orders...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No orders found.</div>
            ) : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filtered.map(order => (
                  <button
                    key={order.id}
                    onClick={() => viewOrder(order)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedOrder?.id === order.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.order_number}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{order.shipping_first_name} {order.shipping_last_name}</p>
                        <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">₱{Number(order.total_amount).toLocaleString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order Detail + Print */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {!selectedOrder ? (
              <div className="p-8 text-center text-gray-500">
                <Printer className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>Select an order to view details and print</p>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900">Order Details</h2>
                  <button
                    onClick={printOrder}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
                  >
                    <Printer className="h-4 w-4" /> Print Order
                  </button>
                </div>

                {/* Printable Content */}
                <div ref={printRef} className="p-6">
                  <h1 className="text-xl font-bold text-gray-900">Fronda Online Store</h1>
                  <p className="text-gray-500 text-sm mb-6">Order Confirmation</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Order Number</p>
                      <p className="font-bold text-gray-900">{selectedOrder.order_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Date</p>
                      <p className="text-gray-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Status</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">Payment</p>
                      <p className="text-gray-900">
                        {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : selectedOrder.payment_method === 'card' ? 'Credit Card' : selectedOrder.payment_method === 'gcash' ? 'GCash' : 'Maya'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">Ship To</p>
                    <p className="font-medium text-gray-900">{selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</p>
                    <p className="text-gray-700 text-sm">{selectedOrder.shipping_address}</p>
                    <p className="text-gray-700 text-sm">{selectedOrder.shipping_city} {selectedOrder.shipping_zip_code}</p>
                    <p className="text-gray-700 text-sm">{selectedOrder.shipping_phone}</p>
                    <p className="text-gray-700 text-sm">{selectedOrder.shipping_email}</p>
                  </div>

                  <table className="w-full text-sm mb-4">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Item</th>
                        <th className="text-center py-2 text-gray-700">Qty</th>
                        <th className="text-right py-2 text-gray-700">Price</th>
                        <th className="text-right py-2 text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item: any) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2 text-gray-900">{item.product_name}</td>
                          <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                          <td className="py-2 text-right text-gray-700">₱{Number(item.product_price).toLocaleString()}</td>
                          <td className="py-2 text-right text-gray-900">₱{Number(item.total_price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="space-y-1 text-sm border-t pt-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>₱{Number(selectedOrder.subtotal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>₱{Number(selectedOrder.shipping_cost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax</span>
                      <span>₱{Number(selectedOrder.tax_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>₱{Number(selectedOrder.total_amount).toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedOrder.shipping_notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                      <p className="font-medium text-gray-700">Delivery Notes:</p>
                      <p className="text-gray-600">{selectedOrder.shipping_notes}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
