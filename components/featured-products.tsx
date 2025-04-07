import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { ProductModal } from "./product-modal"
import { allProducts, type Product } from "@/data/products"

// Get similar products for recommendations
const getSimilarProducts = (currentId: number, category: string): Product[] => {
  return allProducts.filter((p) => p.id !== currentId && p.category === category).slice(0, 4)
}

export function FeaturedProducts() {
  // Use the first 4 products from our data
  const featuredProducts = allProducts.slice(0, 4)

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Featured Products</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Best Sellers</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover our most popular items loved by customers worldwide
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductModal
              key={product.id}
              product={product}
              similarProducts={getSimilarProducts(product.id, product.category)}
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
                  <CardContent className="p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <div className="mt-2 font-bold">KES {product.price.toLocaleString()}</div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

