import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const adminEmails = process.env.ADMIN_EMAILS || ''
    const isAdmin = adminEmails
      .split(',')
      .map(e => e.trim().toLowerCase())
      .includes((email || '').toLowerCase())

    return NextResponse.json({ isAdmin })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
