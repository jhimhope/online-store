'use client'

import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlist } from '@/components/WishlistProvider'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
    removeFromWishlist(item.id)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Save products you love to your wishlist</p>
        <Link href="/products" className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist ({items.length})</h1>
        <button onClick={clearWishlist} className="text-sm text-red-500 hover:text-red-700 font-medium">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/products/${item.id}`}>
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover hover:opacity-90 transition-opacity" />
            </Link>
            <div className="p-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
              <h3 className="font-semibold text-gray-900 mt-2 line-clamp-1">{item.name}</h3>
              <p className="text-primary-600 font-bold text-lg mt-1">₱{Number(item.price).toLocaleString()}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 border border-gray-300 rounded-md text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
