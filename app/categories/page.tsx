import Link from 'next/link'

const categories = [
  { name: 'Electronics', count: 42, color: 'bg-blue-100 text-blue-800' },
  { name: 'Fashion', count: 28, color: 'bg-pink-100 text-pink-800' },
  { name: 'Home & Garden', count: 35, color: 'bg-green-100 text-green-800' },
  { name: 'Sports & Fitness', count: 19, color: 'bg-orange-100 text-orange-800' },
  { name: 'Books', count: 27, color: 'bg-purple-100 text-purple-800' },
  { name: 'Toys & Games', count: 23, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Beauty', count: 31, color: 'bg-red-100 text-red-800' },
  { name: 'Food & Drink', count: 15, color: 'bg-indigo-100 text-indigo-800' },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Categories</h1>
        <p className="text-gray-600">
          Explore products by category
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/products?category=${category.name.toLowerCase()}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                {category.count} items
              </span>
            </div>
            <p className="text-gray-600">
              Browse our collection of {category.name.toLowerCase()} products
            </p>
            <div className="mt-4 text-primary-600 font-medium">
              View products →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}