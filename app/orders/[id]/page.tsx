'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Package, CheckCircle, Clock, Truck, MapPin, CreditCard } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

export default function OrderDetailsPage() {
  const params = useParams()
  const { user } = useAuth()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !orderId) return
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        setOrder(data.order)
        setOrderItems(data.items || [])
      } catch (err) {
        console.error('Error fetching order:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [user, orderId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
        <Link href="/login" className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700">
          Sign In
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Order not found.</p>
        <Link href="/orders" className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/orders" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-700">Order #{order.order_number}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Status</h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Order Items</h3>
            {orderItems.length === 0 ? (
              <p className="text-gray-600">No items found for this order.</p>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">₱{item.product_price.toFixed(2)} each × {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">₱{item.total_price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium text-gray-900">₱{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className="font-medium text-gray-900">₱{order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tax</span>
                <span className="font-medium text-gray-900">₱{order.tax_amount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₱{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Payment</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Method</span>
                <span className="font-medium text-gray-900">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'card' ? 'Credit Card' : 'PayPal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{order.shipping_first_name} {order.shipping_last_name}</p>
              <p className="text-gray-700">{order.shipping_address}</p>
              <p className="text-gray-700">{order.shipping_city} {order.shipping_zip_code}</p>
              <p className="text-gray-700">{order.shipping_phone}</p>
              <p className="text-gray-700">{order.shipping_email}</p>
            </div>
          </div>

          <a href="/products" className="block w-full text-center py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
            Shop Again
          </a>
        </div>
      </div>
    </div>
  )
}
