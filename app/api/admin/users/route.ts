import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET() {
  try {
    // Fetch orders and roles
    const [{ data: orders }, { data: roles }] = await Promise.all([
      supabase.from('orders').select('user_id, total_amount, shipping_email, shipping_first_name, shipping_last_name, created_at'),
      supabase.from('user_roles').select('*')
    ])

    // Try to get auth users (requires service role key)
    let authUsers: any[] = []
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      if (!error && users) authUsers = users
    } catch {}

    // If we have auth users, merge with orders and roles
    if (authUsers.length > 0) {
      const usersWithStats = authUsers.map(user => {
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
    }

    // Fallback: build users from user_roles + orders data
    const roleUsers = roles || []
    const orderEmails = orders?.reduce((acc: any[], o) => {
      if (o.user_id && !acc.find(u => u.id === o.user_id)) {
        acc.push({
          id: o.user_id,
          email: o.shipping_email || 'Unknown',
          created_at: o.created_at,
          last_sign_in: null,
          confirmed: true,
        })
      }
      return acc
    }, []) || []

    // Merge role users and order users
    const allUserIds = new Set([
      ...roleUsers.map(r => r.user_id),
      ...orderEmails.map(u => u.id)
    ])

    const mergedUsers = Array.from(allUserIds).map(userId => {
      const roleEntry = roleUsers.find(r => r.user_id === userId)
      const orderEntry = orderEmails.find(u => u.id === userId)
      const userOrders = orders?.filter(o => o.user_id === userId) || []
      return {
        id: userId,
        email: roleEntry?.email || orderEntry?.email || 'Unknown',
        created_at: roleEntry?.created_at || orderEntry?.created_at,
        last_sign_in: null,
        confirmed: true,
        total_orders: userOrders.length,
        total_spent: userOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        role: roleEntry?.role || 'user',
      }
    })

    return NextResponse.json({ users: mergedUsers })
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json({ users: [] })
  }
}
