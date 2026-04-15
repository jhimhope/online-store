'use client'

import { useState } from 'react'
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  BarChart,
  Settings,
  Eye
} from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'

type Order = {
  id: string
  customer: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  total: number
  items: number
}

type Product = {
  id: string
  name: string
  price: number
  stock: number
  sales: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const stats = [
    { label: 'Total Revenue', value: '$12,458', change: '+12.5%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Orders', value: '342', change: '+8.2%', icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Active Users', value: '1,234', change: '+5.7%', icon: Users, color: 'bg-purple-500' },
    { label: 'Products', value: '89', change: '+3.4%', icon: Package, color: 'bg-orange-500' }
  ]

  const recentOrders: Order[] = [
    { id: 'ORD-001', customer: 'John Doe', date: '2024-04-15', status: 'delivered', total: 156.98, items: 3 },
    { id: 'ORD-002', customer: 'Jane Smith', date: '2024-04-14', status: 'shipped', total: 89.99, items: 1 },
    { id: 'ORD-003', customer: 'Bob Johnson', date: '2024-04-14', status: 'processing', total: 245.50, items: 4 },
    { id: 'ORD-004', customer: 'Alice Brown', date: '2024-04-13', status: 'pending', total: 67.45, items: 2 },
    { id: 'ORD-005', customer: 'Charlie Wilson', date: '2024-04-13', status: 'delivered', total: 189.99, items: 2 }
  ]

  const topProducts: Product[] = [
    { id: '1', name: 'Premium Wireless Headphones', price: 199.99, stock: 45, sales: 128 },
    { id: '2', name: 'Smart Watch Pro', price: 299.99, stock: 32, sales: 95 },
    { id: '3', name: 'Wireless Keyboard', price: 89.99, stock: 67, sales: 84 },
    { id: '4', name: 'Yoga Mat Premium', price: 49.99, stock: 89, sales: 76 },
    { id: '5', name: 'Stainless Steel Water Bottle', price: 34.99, stock: 120, sales: 65 }
  ]

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Check if user is admin (for demo, any logged in user can access)
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the admin dashboard</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'orders', 'products', 'customers', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <Link
                  href="/admin/orders"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all orders →
                </Link>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <div key={product.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{product.sales} sales</p>
                        <p className="text-sm text-gray-600">{product.stock} in stock</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((product.sales / 150) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <Link
                  href="/admin/products"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Manage products →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  Add New Product
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  View Analytics
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  Manage Users
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Chart (Placeholder) */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Sales Analytics</h3>
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <BarChart className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sales chart visualization</p>
              <p className="text-sm text-gray-500">(Chart integration coming soon)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}