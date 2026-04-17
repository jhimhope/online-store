import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ products: data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: body.name,
      description: body.description,
      price: body.price,
      image_url: body.image_url,
      category: body.category,
      stock_quantity: body.stock_quantity,
    })
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ product: data[0] }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { data, error } = await supabase
    .from('products')
    .update({
      name: body.name,
      description: body.description,
      price: body.price,
      image_url: body.image_url,
      category: body.category,
      stock_quantity: body.stock_quantity,
    })
    .eq('id', body.id)
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ product: data[0] })
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
