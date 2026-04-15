import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Our Online Store
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop with confidence and convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-100"
            >
              Shop Now
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}