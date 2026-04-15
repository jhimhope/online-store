'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

type ProductGridProps = {
  category?: string
  priceRange?: { min: number; max: number }
  sortBy?: string
}

export default function ProductGrid({ category, priceRange, sortBy = 'featured' }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'Noise-cancelling wireless headphones with premium sound quality',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      description: 'Advanced smartwatch with health monitoring and GPS',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable organic cotton t-shirt in various colors',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      category: 'Fashion'
    },
    {
      id: 4,
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop',
      category: 'Home'
    },
    {
      id: 5,
      name: 'Wireless Keyboard',
      description: 'Ergonomic wireless keyboard with backlit keys',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
      category: 'Electronics'
    },
    {
      id: 6,
      name: 'Yoga Mat Premium',
      description: 'Non-slip yoga mat with carrying strap',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop',
      category: 'Fitness'
    },
    {
      id: 7,
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with 360° sound',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
      category: 'Electronics'
    },
    {
      id: 8,
      name: 'Running Shoes',
      description: 'Lightweight running shoes with cushioning',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      category: 'Fitness'
    },
    {
      id: 9,
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
      category: 'Home'
    }
  ])

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  useEffect(() => {
    let result = [...products]

    // Apply category filter
    if (category && category !== 'All') {
      result = result.filter(product => product.category === category)
    }

    // Apply price range filter
    if (priceRange) {
      result = result.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        // For demo, sort by ID descending (newest first)
        result.sort((a, b) => b.id - a.id)
        break
      case 'popular':
        // For demo, sort by price (higher price = more popular)
        result.sort((a, b) => b.price - a.price)
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(result)
  }, [category, priceRange, sortBy, products])

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters to find what you're looking for</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}