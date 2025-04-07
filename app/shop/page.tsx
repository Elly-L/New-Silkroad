"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductModal } from "@/components/product-modal"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams } from "next/navigation"
import { categories } from "@/data/products"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllProducts } from "@/app/actions/shop-actions"

interface Product {
  id: string
  name: string
  price: number
  image?: string
  images?: { url: string; is_main: boolean }[]
  category: string
  description: string
  features?: string[]
  specifications?: Record<string, string>
  rating?: number
  reviews?: number
  in_stock?: boolean
  vendor_id?: string
  vendor_email?: string
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000])
  const [sortOption, setSortOption] = useState("featured")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await getAllProducts()

        if (error) {
          console.error("Error fetching products:", error)
          setError(`Error fetching products: ${error.message}`)
        }

        if (data) {
          setAllProducts(data)
        }
      } catch (error: any) {
        console.error("Error in fetchProducts:", error)
        setError(`Error fetching products: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Add this useEffect to handle URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      // Find the matching category
      const matchedCategory = categories.find(
        (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === categoryParam.toLowerCase(),
      )
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id)
      }
    }
  }, [searchParams])

  // Apply filters
  useEffect(() => {
    if (allProducts.length === 0) return

    let result = [...allProducts]

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category.toLowerCase() === selectedCategory.replace(/-/g, " "))
    }

    // Filter by price range
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Filter by stock
    if (inStockOnly) {
      result = result.filter((product) => product.in_stock)
    }

    // Sort products
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        // In a real app, you would sort by date
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      default: // featured
        // Keep original order
        break
    }

    setFilteredProducts(result)
  }, [selectedCategory, priceRange, sortOption, inStockOnly, allProducts])

  const handlePriceInputChange = () => {
    const min = minPrice === "" ? 0 : Number.parseInt(minPrice)
    const max = maxPrice === "" ? 150000 : Number.parseInt(maxPrice)
    setPriceRange([min, max])
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  const applyFilters = () => {
    handlePriceInputChange()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Categories</h3>
                <div className="space-y-2">
                  <Button
                    key="all"
                    variant={selectedCategory === "all" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleCategoryClick("all")}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[0, 150000]}
                    max={150000}
                    step={1000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="py-4"
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="h-9"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="h-9"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <Button onClick={applyFilters} className="w-full">
                    Apply Filter
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Availability</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "all"
                    ? "All Products"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                  <span className="ml-2 text-sm font-normal text-gray-500">({filteredProducts.length} products)</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <Select defaultValue={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange([0, 150000])
                      setInStockOnly(false)
                      setSortOption("featured")
                      setMinPrice("")
                      setMaxPrice("")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductModal
                      key={product.id}
                      product={product}
                      similarProducts={allProducts
                        .filter((p) => p.id !== product.id && p.category === product.category)
                        .slice(0, 4)}
                      trigger={
                        <Card className="overflow-hidden rounded-xl cursor-pointer hover:shadow-lg transition-all">
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</div>
                            <h3 className="text-lg font-medium">{product.name}</h3>
                            <div className="mt-2 font-bold">KES {product.price.toLocaleString()}</div>
                            <div className="mt-4">
                              <Button className="w-full">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </Card>
                      }
                    />
                  ))}
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <Button variant="outline" size="icon">
                      1
                    </Button>
                    <Button variant="outline" size="icon">
                      2
                    </Button>
                    <Button variant="outline" size="icon">
                      3
                    </Button>
                    <Button variant="outline" size="icon">
                      ...
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

