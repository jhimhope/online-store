import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL || 'jhimhope@yahoo.com'
    const staffEmails = process.env.STAFF_EMAILS || ''

    const isAdmin = email?.toLowerCase() === adminEmail.toLowerCase()
    const isStaff = staffEmails
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)
      .includes((email || '').toLowerCase())

    return NextResponse.json({ isAdmin, isStaff: isAdmin || isStaff })
  } catch {
    return NextResponse.json({ isAdmin: false, isStaff: false })
  }
}
