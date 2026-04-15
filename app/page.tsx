import ProductGrid from '@/components/ProductGrid'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <ProductGrid />
      </div>
    </div>
  )
}