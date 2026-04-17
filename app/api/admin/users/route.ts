import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Fetch orders and roles
    const [{ data: orders }, { data: roles }] = await Promise.all([
      supabase.from('orders').select('user_id, total_amount'),
      supabase.from('user_roles').select('*')
    ])

    const usersWithStats = users.map(user => {
      const userOrders = orders?.filter(o => o.user_id === user.id) || []
      const userRole = roles?.find(r => r.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        confirmed: !!user.email_confirmed_at,
        total_orders: userOrders.length,
        total_spent: userOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        role: userRole?.role || 'user',
      }
    })

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
