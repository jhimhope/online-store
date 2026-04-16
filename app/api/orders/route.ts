import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: any) {
            cookiesToSet.forEach(({ name, value }: any) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: body.orderNumber,
        payment_method: body.paymentMethod,
        payment_status: body.paymentMethod === 'cod' ? 'pending' : 'paid',
        shipping_first_name: body.firstName,
        shipping_last_name: body.lastName,
        shipping_email: body.email,
        shipping_phone: body.phone,
        shipping_address: body.address,
        shipping_city: body.city,
        shipping_zip_code: body.zipCode,
        shipping_country: body.country || 'US',
        shipping_notes: body.notes,
        subtotal: body.subtotal,
        shipping_cost: body.shippingCost,
        tax_amount: body.tax,
        cod_fee: 0,
        total_amount: body.total,
      })
      .select()

    if (orderError) {
      return NextResponse.json(
        { error: orderError.message },
        { status: 400 }
      )
    }

    // Create order items
    if (body.items && body.items.length > 0) {
      const orderItems = body.items.map((item: any) => ({
        order_id: order[0].id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        return NextResponse.json(
          { error: itemsError.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: true, order: order[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: any) {
            cookiesToSet.forEach(({ name, value }: any) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user's orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersError) {
      return NextResponse.json(
        { error: ordersError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
