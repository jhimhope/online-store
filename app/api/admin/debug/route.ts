import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  try {
    const supabase = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase.auth.admin.listUsers()

    return NextResponse.json({
      url: url,
      serviceKeyRole: serviceKey ? 'present' : 'missing',
      usersFound: data?.users?.length ?? 0,
      userEmails: data?.users?.map(u => u.email) ?? [],
      error: error?.message ?? null,
      status: error ? 'failed' : 'success'
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack })
  }
}
