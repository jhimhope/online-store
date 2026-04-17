import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClient(url!, serviceKey || anonKey!)

  let authUsers: any[] = []
  let authError: any = null
  try {
    const { data, error } = await supabase.auth.admin.listUsers()
    authUsers = data?.users || []
    authError = error?.message ?? null
  } catch (e: any) {
    authError = e.message
  }

  const { data: roles, error: rolesError } = await supabase.from('user_roles').select('*')
  const { data: products, error: productsError } = await supabase.from('products').select('id').limit(1)

  return NextResponse.json({
    url: url?.substring(0, 30) + '...',
    hasServiceKey: !!serviceKey,
    serviceKeyPrefix: serviceKey?.substring(0, 20),
    authUsersCount: authUsers.length,
    authUserEmails: authUsers.map(u => u.email),
    authError,
    rolesCount: roles?.length ?? 0,
    rolesError: rolesError?.message ?? null,
    productsCount: products?.length ?? 0,
    productsError: productsError?.message ?? null,
  })
}
