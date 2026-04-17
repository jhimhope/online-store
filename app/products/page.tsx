'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import { Filter, X, Search } from 'lucide-react'

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Fitness', 'Sports', 'Books', 'Beauty']

const priceRanges = [
  { label: 'All', min: 0, max: 999999 },
  { label: 'Under ₱500', min: 0, max: 500 },
  { label: '₱500 - ₱1,000', min: 500, max: 1000 },
  { label: '₱1,000 - ₱5,000', min: 1000, max: 5000 },
  { label: 'Over ₱5,000', min: 5000, max: 999999 }
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') || ''

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [inputValue, setInputValue] = useState(urlSearch)

  useEffect(() => {
    setSearchQuery(urlSearch)
    setInputValue(urlSearch)
  }, [urlSearch])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(inputValue.trim())
  }

  const clearSearch = () => {
    setInputValue('')
    setSearchQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
            {searchQuery && (
              <p className="text-gray-600">
                Showing results for <span className="font-medium text-primary-600">"{searchQuery}"</span>
                <button onClick={clearSearch} className="ml-2 text-red-500 hover:text-red-700 text-sm underline">
                  Clear
                </button>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
            Search
          </button>
          {(inputValue || searchQuery) && (
            <button type="button" onClick={clearSearch} className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Category</h4>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedCategory === category ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-1">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(range.label)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedPriceRange === range.label ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            {(selectedCategory !== 'All' || selectedPriceRange !== 'All' || searchQuery) && (
              <button
                onClick={() => { setSelectedCategory('All'); setSelectedPriceRange('All'); clearSearch() }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          <ProductGrid
            category={selectedCategory === 'All' ? undefined : selectedCategory}
            priceRange={selectedPriceRange === 'All' ? undefined : priceRanges.find(r => r.label === selectedPriceRange)}
            sortBy={sortBy}
            searchQuery={searchQuery || undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="text-gray-600">Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  )
}

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Fitness', 'Sports', 'Books', 'Beauty']

const priceRanges = [
  { label: 'All', min: 0, max: 999999 },
  { label: 'Under ₱500', min: 0, max: 500 },
  { label: '₱500 - ₱1,000', min: 500, max: 1000 },
  { label: '₱1,000 - ₱5,000', min: 1000, max: 5000 },
  { label: 'Over ₱5,000', min: 5000, max: 999999 }
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') || ''

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [inputValue, setInputValue] = useState(urlSearch)

  // Update search when URL changes
  useEffect(() => {
    setSearchQuery(urlSearch)
    setInputValue(urlSearch)
  }, [urlSearch])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(inputValue.trim())
  }

  const clearSearch = () => {
    setInputValue('')
    setSearchQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
            {searchQuery && (
              <p className="text-gray-600">
                Showing results for <span className="font-medium text-primary-600">"{searchQuery}"</span>
                <button onClick={clearSearch} className="ml-2 text-red-500 hover:text-red-700 text-sm underline">
                  Clear
                </button>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Search bar on products page */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
            Search
          </button>
          {(inputValue || searchQuery) && (
            <button type="button" onClick={clearSearch} className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Category</h4>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-1">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(range.label)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedPriceRange === range.label
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'All' || selectedPriceRange !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedPriceRange('All')
                  clearSearch()
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid
            category={selectedCategory === 'All' ? undefined : selectedCategory}
            priceRange={selectedPriceRange === 'All' ? undefined : priceRanges.find(r => r.label === selectedPriceRange)}
            sortBy={sortBy}
            searchQuery={searchQuery || undefined}
          />
        </div>
      </div>
    </div>
  )
}
