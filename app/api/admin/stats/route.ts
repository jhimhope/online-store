import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Total revenue and orders
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, created_at, status, payment_method')

    // Products and inventory
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, category')

    // Order items for sales data
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_name, product_price, quantity, total_price, created_at')

    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
    const totalOrders = orders?.length || 0
    const totalProducts = products?.length || 0
    const lowStockProducts = products?.filter(p => p.stock_quantity <= 5) || []
    const outOfStockProducts = products?.filter(p => p.stock_quantity === 0) || []

    // Revenue by month (last 6 months)
    const now = new Date()
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const monthOrders = orders?.filter(o => {
        const orderDate = new Date(o.created_at)
        return orderDate >= date && orderDate < nextDate
      }) || []
      const revenue = monthOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)
      monthlyRevenue.push({
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        revenue,
        orders: monthOrders.length
      })
    }

    // Orders by status
    const ordersByStatus = {
      pending: orders?.filter(o => o.status === 'pending').length || 0,
      processing: orders?.filter(o => o.status === 'processing').length || 0,
      shipped: orders?.filter(o => o.status === 'shipped').length || 0,
      delivered: orders?.filter(o => o.status === 'delivered').length || 0,
      cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
    }

    // Top selling products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
    orderItems?.forEach(item => {
      if (!productSales[item.product_name]) {
        productSales[item.product_name] = { name: item.product_name, quantity: 0, revenue: 0 }
      }
      productSales[item.product_name].quantity += item.quantity
      productSales[item.product_name].revenue += Number(item.total_price)
    })
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    // Payment method breakdown
    const paymentBreakdown = {
      cod: orders?.filter(o => o.payment_method === 'cod').length || 0,
      card: orders?.filter(o => o.payment_method === 'card').length || 0,
      paypal: orders?.filter(o => o.payment_method === 'paypal').length || 0,
    }

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      monthlyRevenue,
      ordersByStatus,
      topProducts,
      paymentBreakdown,
      inventory: products || [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
