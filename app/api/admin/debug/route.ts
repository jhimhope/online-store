import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClient(url!, serviceKey || anonKey!)

  // Test auth.admin
  let authResult: any = null
  let authError: any = null
  try {
    const { data, error } = await supabase.auth.admin.listUsers()
    authResult = data?.users?.length ?? 0
    authError = error?.message ?? null
  } catch (e: any) {
    authError = e.message
  }

  // Test user_roles table
  const { data: roles, error: rolesError } = await supabase.from('user_roles').select('*')

  return NextResponse.json({
    hasUrl: !!url,
    hasServiceKey: !!serviceKey,
    hasAnonKey: !!anonKey,
    usingServiceKey: !!serviceKey,
    authUsersCount: authResult,
    authError,
    rolesCount: roles?.length ?? 0,
    rolesError: rolesError?.message ?? null,
    roles,
  })
}
