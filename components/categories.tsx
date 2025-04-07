import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Home Decor",
    image: "/images/plant-vase.png",
    description: "Elevate your space with our stylish home accessories",
    link: "/shop?category=home-decor",
  },
  {
    id: 2,
    name: "Furniture",
    image: "/images/dining-table.png",
    description: "Quality furniture for every room in your home",
    link: "/shop?category=furniture",
  },
  {
    id: 3,
    name: "Office",
    image: "/images/office-desk.png",
    description: "Everything you need for a productive workspace",
    link: "/shop?category=office",
  },
]

export function Categories() {
  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse our curated collections to find exactly what you need
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={category.link} className="group">
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

