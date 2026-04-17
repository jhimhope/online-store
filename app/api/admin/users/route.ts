import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service role needed to access auth.users
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch users from auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Fetch order counts per user
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id, total_amount')

    // Map user data with order stats
    const usersWithStats = users.map(user => {
      const userOrders = orders?.filter(o => o.user_id === user.id) || []
      const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        confirmed: !!user.email_confirmed_at,
        total_orders: userOrders.length,
        total_spent: totalSpent,
      }
    })

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
