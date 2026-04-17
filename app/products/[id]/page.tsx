'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShoppingCart, ArrowLeft, Star, Package, Heart } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useWishlist } from '@/components/WishlistProvider'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [product, setProduct] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const data = await res.json()
        setProduct(data.product)
        // Fetch related products same category
        if (data.product?.category) {
          const relRes = await fetch(`/api/products?category=${data.product.category}`)
          const relData = await relRes.json()
          setRelated((relData.products || []).filter((p: any) => p.id !== params.id).slice(0, 4))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image_url })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-12 bg-gray-200 rounded w-1/2 mt-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <Link href="/products" className="text-primary-600 hover:underline">← Back to Products</Link>
      </div>
    )
  }

  const outOfStock = product.stock_quantity === 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative">
          <img
            src={product.image_url || 'https://via.placeholder.com/600x400'}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow-md"
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <span className="text-sm text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>
          </div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-500 ml-2">(4.8 · 24 reviews)</span>
          </div>

          <p className="text-4xl font-bold text-primary-600">₱{Number(product.price).toLocaleString()}</p>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Stock info */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            {outOfStock ? (
              <span className="text-red-600 font-medium text-sm">Out of Stock</span>
            ) : (
              <span className="text-green-600 font-medium text-sm">{product.stock_quantity} in stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {!outOfStock && (
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 text-lg font-medium"
                >−</button>
                <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 text-lg font-medium"
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image_url, category: product.category })}
                className={`p-3 border rounded-md transition-colors ${isInWishlist(product.id) ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500'}`}
                title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          )}

          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <p>✓ Free delivery on orders over ₱1,000</p>
            <p>✓ Easy 30-day returns</p>
            <p>✓ Secure checkout</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{p.name}</h3>
                  <p className="text-primary-600 font-bold mt-1">₱{Number(p.price).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
