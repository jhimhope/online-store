import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Get all user roles
export async function GET() {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ roles: data })
}

// Assign or update a role
export async function POST(request: NextRequest) {
  const { user_id, email, role } = await request.json()
  const { data, error } = await supabase
    .from('user_roles')
    .upsert({ user_id, email, role, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ role: data[0] })
}

// Remove a role (revert to regular user)
export async function DELETE(request: NextRequest) {
  const { user_id } = await request.json()
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', user_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
