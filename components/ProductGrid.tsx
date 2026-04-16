'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock_quantity: number
}

type ProductGridProps = {
  category?: string
  priceRange?: { min: number; max: number }
  sortBy?: string
  searchQuery?: string
}

export default function ProductGrid({ category, priceRange, sortBy = 'featured', searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (category) params.append('category', category)
        if (searchQuery) params.append('search', searchQuery)

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, searchQuery])

  // Apply client-side price filter and sorting
  let filtered = [...products]

  if (priceRange) {
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
  }

  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      filtered.reverse()
      break
    default:
      break
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image_url,
          category: product.category,
          stock_quantity: product.stock_quantity
        }} />
      ))}
    </div>
  )
}
