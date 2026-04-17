import { NextRequest, NextResponse } from 'next/server'

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY || ''
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://online-store-jhimhope.vercel.app'

export async function POST(request: NextRequest) {
  try {
    const { amount, method, orderNumber, description } = await request.json()

    if (!PAYMONGO_SECRET) {
      return NextResponse.json({ error: 'PayMongo not configured' }, { status: 500 })
    }

    // Convert to centavos (PayMongo uses smallest currency unit)
    const amountInCentavos = Math.round(amount * 100)

    // Create PayMongo payment link
    const response = await fetch('https://api.paymongo.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET + ':').toString('base64')}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amountInCentavos,
            description: description || `Order ${orderNumber}`,
            remarks: orderNumber,
          }
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('PayMongo error:', data)
      return NextResponse.json({ error: data.errors?.[0]?.detail || 'Payment failed' }, { status: 400 })
    }

    const checkoutUrl = data.data?.attributes?.checkout_url

    return NextResponse.json({
      success: true,
      checkoutUrl,
      linkId: data.data?.id,
    })
  } catch (error) {
    console.error('PayMongo error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
