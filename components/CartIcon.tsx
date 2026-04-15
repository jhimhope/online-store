'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from './CartProvider'
import Link from 'next/link'

export default function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  )
}