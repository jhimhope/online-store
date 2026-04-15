'use client'

import { useParams } from 'next/navigation'
import { Package, CheckCircle, Clock, Truck, MapPin, CreditCard, User } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

type Order = {
  id: string
  orderNumber: string
  date: string
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled'
  paymentMethod: string
  paymentStatus: 'paid' | 'pending' | 'failed'
  shippingAddress: {
    name: string
    address: string
    city: string
    zipCode: string
    phone: string
    email: string
  }
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  codFee: number
  totalAmount: number
}

export default function OrderDetailsPage() {
  const params = useParams()
  const { user } = useAuth()
  const orderId = params.id as string

  // Mock order data
  const order: Order = {
    id: orderId,
    orderNumber: 'ORD-20240415-001',
    date: '2024-04-15',
    status: 'delivered',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'paid',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      phone: '+1 (555) 123-4567',
      email: 'john@example.com'
    },
    items: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
      },
      {
        id: '2',
        name: 'Smart Watch Pro',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
      },
      {
        id: '3',
        name: 'Organic Cotton T-Shirt',
        price: 29.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
      }
    ],
    subtotal: 529.96,
    shippingCost: 5.00,
    taxAmount: 42.40,
    codFee: 2.00,
    totalAmount: 579.36
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'shipped':
        return <Truck className="h-6 w-6 text-blue-500" />
      case 'processing':
        return <Clock className="h-6 w-6 text-yellow-500" />
      default:
        return <Package className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'shipped':
        return 'Shipped'
      case 'processing':
        return 'Processing'
      default:
        return 'Cancelled'
    }
  }

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view order details</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/orders"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600">Order #{order.orderNumber}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {getStatusIcon(order.status)}
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">{order.date}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">Your order has been received</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' 
                        ? 'bg-primary-600' : 'bg-gray-200'
                    }`}>
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">We're preparing your order</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      order.status === 'shipped' || order.status === 'delivered' 
                        ? 'bg-primary-600' : 'bg-gray-200'
                    }`}>
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-600">Your order is on the way</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      order.status === 'delivered' 
                        ? 'bg-primary-600' : 'bg-gray-200'
                    }`}>
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">Your order has been delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Order Items</h3>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-6 last:border-0">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${order.shippingCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Shipping Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                <p className="text-sm text-gray-600">Email: {order.shippingAddress.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Download Invoice
            </button>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Track Shipment
            </button>
            <Link
              href="/products"
              className="block w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 text-center"
            >
              Shop Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}