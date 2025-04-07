import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">New Collection</div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Discover the Modern Way to Shop</h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore our curated collection of premium products from around the world. The new silk road connects you
              to quality goods at exceptional prices.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="h-12 px-6" asChild>
                <Link href="/shop">
                  Shop Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="h-12 px-6" asChild>
                <Link href="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
              <Image
                src="/images/yellow-bags.png"
                alt="Shopping bags arranged in a grid"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

