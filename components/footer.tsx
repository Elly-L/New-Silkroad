import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="NewSilkroad Logo" width={40} height={40} />
              <div>
                <h3 className="text-lg font-medium text-green-600">NewSilkroad</h3>
                <p className="text-xs text-gray-500">blackmarket</p>
              </div>
            </div>
            <p className="max-w-xs text-sm text-gray-500">
              Connecting you to premium products from around the world with exceptional quality and value.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-gray-500 hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home-decor" className="text-gray-500 hover:text-gray-900">
                  Home Decor
                </Link>
              </li>
              <li>
                <Link href="/shop?category=furniture" className="text-gray-500 hover:text-gray-900">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/shop?category=office" className="text-gray-500 hover:text-gray-900">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/shop?new=true" className="text-gray-500 hover:text-gray-900">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#careers" className="text-gray-500 hover:text-gray-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Newsletter</h3>
            <p className="text-sm text-gray-500">Subscribe to our newsletter for the latest products and promotions.</p>
            <form className="flex gap-2">
              <Input placeholder="Enter your email" type="email" className="max-w-xs" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} NewSilkroad. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-900">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* El-Tek Product Feature */}
        <div className="mt-12 rounded-lg bg-gray-50 p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative h-40 w-40 overflow-hidden rounded-lg">
              <Image src="/images/shopping-key.png" alt="El-Tek Smart Shopping Key" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="text-sm font-medium text-gray-500">Featured Partner</div>
              <h3 className="text-xl font-bold">El-Tek Smart Shopping Key</h3>
              <p className="text-gray-500">
                Transform your online shopping experience with El-Tek's revolutionary Smart Shopping Key. One-click
                checkout for all your favorite stores.
              </p>
              <Button variant="outline" asChild>
                <Link href="https://eltek.netlify.app" target="_blank" rel="noopener noreferrer">
                  Visit El-Tek
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

