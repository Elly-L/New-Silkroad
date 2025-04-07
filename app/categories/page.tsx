import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const categories = [
  {
    id: 1,
    name: "Home Decor",
    image: "/images/plant-vase.png",
    description: "Elevate your space with our stylish home accessories",
    products: 24,
  },
  {
    id: 2,
    name: "Furniture",
    image: "/images/dining-table.png",
    description: "Quality furniture for every room in your home",
    products: 18,
  },
  {
    id: 3,
    name: "Office",
    image: "/images/office-desk.png",
    description: "Everything you need for a productive workspace",
    products: 15,
  },
  {
    id: 4,
    name: "Bedroom",
    image: "/images/bedroom-set.png",
    description: "Create a peaceful retreat with our bedroom collection",
    products: 12,
  },
  {
    id: 5,
    name: "Appliances",
    image: "/images/home-appliances.png",
    description: "Premium appliances for the modern home",
    products: 20,
  },
  {
    id: 6,
    name: "Outdoor",
    image: "/images/outdoor-furniture.png",
    description: "Furnish your outdoor spaces with style and durability",
    products: 9,
  },
]

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Browse our curated collections to find exactly what you need
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group"
              >
                <Card className="overflow-hidden rounded-xl transition-all hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/40" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="mt-2 text-gray-500">{category.description}</p>
                    <div className="mt-4 text-sm text-gray-400">{category.products} products</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

