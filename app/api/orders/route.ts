import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Use service role to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: body.userId || null,
        order_number: body.orderNumber,
        payment_method: body.paymentMethod,
        payment_status: body.paymentMethod === 'cod' ? 'pending' : 'paid',
        shipping_first_name: body.firstName,
        shipping_last_name: body.lastName,
        shipping_email: body.email || '',
        shipping_phone: body.phone,
        shipping_address: body.address,
        shipping_city: body.city || '',
        shipping_zip_code: body.zipCode || '',
        shipping_country: body.country || 'PH',
        shipping_notes: body.notes || '',
        subtotal: body.subtotal,
        shipping_cost: body.shippingCost,
        tax_amount: body.tax,
        cod_fee: 0,
        total_amount: body.total,
      })
      .select()

    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    // Create order items
    if (body.items && body.items.length > 0 && order && order[0]) {
      const orderItems = body.items.map((item: any) => ({
        order_id: order[0].id,
        product_id: null, // skip product_id FK since items may not be in DB
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items insert error:', itemsError)
      }
    }

    return NextResponse.json({ success: true, order: order?.[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ orders: [] }, { status: 200 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
