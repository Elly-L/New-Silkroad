"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { PaymentOptions } from "./payment-options"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product } from "@/data/products"

interface ProductModalProps {
  product: Product
  trigger?: React.ReactNode
  similarProducts?: Product[]
  allProducts?: Product[]
}

export function ProductModal({ product, trigger, similarProducts, allProducts }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image)

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Enhance product with default values if not provided
  const enhancedProduct = {
    ...product,
    images: product.images || [product.image],
    features: product.features || [
      "Premium quality materials",
      "Handcrafted with attention to detail",
      "Unique design exclusive to NewSilkroad",
      "Ethically sourced and sustainable",
    ],
    specifications: product.specifications || {
      Material: "High-quality ceramic/wood/fabric",
      Dimensions: "Various sizes available",
      Weight: "Depends on the specific item",
      Color: "As shown in the image",
      Care: "Wipe clean with a damp cloth",
    },
    rating: product.rating || 4.8,
    reviews: product.reviews || 24,
    inStock: product.inStock !== undefined ? product.inStock : true,
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl">{enhancedProduct.name}</DialogTitle>
                {enhancedProduct.inStock ? (
                  <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <DialogDescription className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(enhancedProduct.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {enhancedProduct.rating} ({enhancedProduct.reviews} reviews)
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={selectedImage || enhancedProduct.image}
                    alt={enhancedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-auto pb-2">
                  {enhancedProduct.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-20 w-20 overflow-hidden rounded-md border-2 ${selectedImage === image ? "border-green-600" : "border-transparent"}`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${enhancedProduct.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-3xl font-bold">KES {enhancedProduct.price.toLocaleString()}</div>

                  <p className="text-gray-700">{enhancedProduct.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {enhancedProduct.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={decreaseQuantity}
                        disabled={!enhancedProduct.inStock}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={increaseQuantity}
                        disabled={!enhancedProduct.inStock}
                      >
                        +
                      </Button>
                    </div>
                    <Button className="flex-1" disabled={!enhancedProduct.inStock}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span>Free delivery on orders over KES 10,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>2-year warranty on all products</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RotateCcw className="h-4 w-4 text-green-600" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="specifications" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="payment">Payment Options</TabsTrigger>
                  </TabsList>
                  <TabsContent value="specifications" className="space-y-4">
                    <div className="space-y-2">
                      {Object.entries(enhancedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b pb-2">
                          <span className="font-medium">{key}</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="payment" className="space-y-4">
                    <PaymentOptions totalAmount={enhancedProduct.price * quantity} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {similarProducts && similarProducts.length > 0 && (
              <div className="mt-8">
                <Separator className="my-4" />
                <h3 className="text-xl font-semibold mb-4">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {similarProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group cursor-pointer"
                      onClick={() => {
                        // Close current dialog and open new product
                        const closeButton = document.querySelector(
                          '[data-state="open"] [aria-label="Close"]',
                        ) as HTMLButtonElement
                        if (closeButton) closeButton.click()

                        // Small timeout to ensure current dialog closes first
                        setTimeout(() => {
                          const newDialog = document.createElement("div")
                          document.body.appendChild(newDialog)

                          // Create a new ProductModal for the clicked product
                          const productModal = (
                            <ProductModal
                              product={product}
                              similarProducts={allProducts
                                .filter((p) => p.id !== product.id && p.category === product.category)
                                .slice(0, 4)}
                              allProducts={allProducts}
                            />
                          )

                          // Trigger click on the new dialog
                          const triggerButton = newDialog.querySelector("button") as HTMLButtonElement
                          if (triggerButton) triggerButton.click()
                        }, 100)
                      }}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-md mb-2">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      <p className="text-sm text-gray-500">KES {product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

