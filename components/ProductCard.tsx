'use client'

import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from './CartProvider'

type ProductCardProps = {
  product: {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    stock_quantity?: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (product.stock_quantity === 0) return
    setIsAdding(true)
    addToCart({
      id: product.id as any,
      name: product.name,
      price: product.price,
      image: product.image
    })
    setTimeout(() => setIsAdding(false), 500)
  }

  const outOfStock = product.stock_quantity === 0

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary-600">
            ₱{product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || outOfStock}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? 'Added!' : outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
