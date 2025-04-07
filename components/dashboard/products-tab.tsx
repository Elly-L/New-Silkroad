"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, ImagePlus, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { categories } from "@/data/products"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  uploadProductImage,
  addProductImage,
  getProductImages,
} from "@/app/actions/product-actions"

interface ProductImage {
  id: string
  url: string
  isMain: boolean
}

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  features: string[]
  specifications: Record<string, string>
  in_stock: boolean
  images: ProductImage[]
  created_at: string
  vendor_id: string
  email?: string
}

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    features: "",
    specifications: "",
    in_stock: true,
  })
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      setDebugInfo(null)

      if (!user) {
        setDebugInfo("No user found. Please sign in.")
        return
      }

      setDebugInfo(`Fetching products for user: ${user.id}`)
      const { data, error } = await getVendorProducts()

      if (error) {
        console.error("Error fetching products:", error)
        setError(`Error fetching products: ${error.message}`)
        setDebugInfo(`Error response: ${JSON.stringify(error)}`)
        return
      }

      setDebugInfo(`Received ${data?.length || 0} products from database`)

      // Transform the data to match the expected format
      const productsWithImages = await Promise.all(
        (data || []).map(async (product: any) => {
          try {
            setDebugInfo(`Fetching images for product: ${product.id}`)
            const { data: imageData, error: imageError } = await getProductImages(product.id)

            if (imageError) {
              console.error("Error fetching product images:", imageError)
              setDebugInfo(`Error fetching images for product ${product.id}: ${imageError.message}`)
              return {
                ...product,
                images: [],
              }
            }

            setDebugInfo(`Received ${imageData?.length || 0} images for product ${product.id}`)

            return {
              ...product,
              images:
                imageData?.map((img: any) => ({
                  id: img.id,
                  url: img.url,
                  isMain: img.is_main,
                })) || [],
            }
          } catch (err: any) {
            console.error("Error processing product:", err)
            setDebugInfo(`Error processing product ${product.id}: ${err.message}`)
            return {
              ...product,
              images: [],
            }
          }
        }),
      )

      setProducts(productsWithImages)
      setDebugInfo(`Processed ${productsWithImages.length} products with images`)
    } catch (error: any) {
      console.error("Error in fetchProducts:", error)
      setError(`Error fetching products: ${error.message}`)
      setDebugInfo(`Exception: ${error.stack}`)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      features: "",
      specifications: "",
      in_stock: true,
    })
    setImages([])
    setImageUrls([])
    setEditingProduct(null)
    setError(null)
    setDebugInfo(null)
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      features: product.features?.join("\n") || "",
      specifications: Object.entries(product.specifications || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
      in_stock: product.in_stock,
    })
    setShowForm(true)
    setError(null)
    setDebugInfo(null)
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      setLoading(true)
      setError(null)
      setDebugInfo(null)

      const { error } = await deleteVendorProduct(id)

      if (error) {
        console.error("Error deleting product:", error)
        setError(`Error deleting product: ${error.message}`)
        setDebugInfo(`Delete error: ${JSON.stringify(error)}`)
        return
      }

      setProducts(products.filter((p) => p.id !== id))
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
        variant: "success",
      })
    } catch (error: any) {
      console.error("Error in handleDeleteProduct:", error)
      setError(`Error deleting product: ${error.message}`)
      setDebugInfo(`Delete exception: ${error.stack}`)
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)
    setImages((prev) => [...prev, ...newFiles])

    // Create preview URLs
    const newUrls = newFiles.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...newUrls])
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setError("You must be signed in to create products")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setDebugInfo(null)

      // Parse form data
      const productData = {
        name: formData.name,
        price: Number.parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        features: formData.features.split("\n").filter((f) => f.trim()),
        specifications: Object.fromEntries(
          formData.specifications
            .split("\n")
            .filter((s) => s.includes(":"))
            .map((s) => {
              const [key, value] = s.split(":")
              return [key.trim(), value.trim()]
            }),
        ),
        in_stock: formData.in_stock,
        vendor_id: user.id,
        email: user.email,
      }

      setDebugInfo(`Submitting product data: ${JSON.stringify(productData)}`)
      setDebugInfo(`User ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`)

      let productId: string

      if (editingProduct) {
        // Update existing product
        const { error } = await updateVendorProduct(editingProduct.id, productData)

        if (error) {
          console.error("Error updating product:", error)
          setError(`Error updating product: ${error.message}`)
          setDebugInfo(`Update error: ${JSON.stringify(error)}`)
          return
        }

        productId = editingProduct.id
        setDebugInfo(`Updated product with ID: ${productId}`)

        toast({
          title: "Product updated",
          description: "Your product has been updated successfully",
          variant: "success",
        })
      } else {
        // Create new product
        const { data, error } = await createVendorProduct(productData)

        if (error) {
          console.error("Error creating product:", error)
          setError(`Error creating product: ${error.message}`)
          setDebugInfo(`Create error: ${JSON.stringify(error)}`)
          return
        }

        if (!data) {
          throw new Error("Failed to create product - no data returned")
        }

        productId = data
        setDebugInfo(`Created new product with ID: ${productId}`)

        toast({
          title: "Product created",
          description: "Your product has been created successfully",
          variant: "success",
        })
      }

      // Upload images if any
      if (images.length > 0) {
        setDebugInfo(`Uploading ${images.length} images for product ${productId}`)

        for (let i = 0; i < images.length; i++) {
          const file = images[i]

          // Upload the image to storage
          setDebugInfo(`Uploading image ${i + 1}/${images.length}: ${file.name}`)
          const { url, error: uploadError } = await uploadProductImage(productId, file)

          if (uploadError || !url) {
            console.error("Error uploading image:", uploadError)
            setDebugInfo(`Image upload error for image ${i}: ${JSON.stringify(uploadError)}`)
            continue // Continue with other images even if one fails
          }

          setDebugInfo(`Image ${i} uploaded to: ${url}`)

          // Save image reference to database
          setDebugInfo(`Saving image reference to database, isMain=${i === 0}`)
          const { error: imageError } = await addProductImage(productId, url, i === 0) // First image is main

          if (imageError) {
            console.error("Error saving image reference:", imageError)
            setDebugInfo(`Image reference error for image ${i}: ${JSON.stringify(imageError)}`)
          } else {
            setDebugInfo(`Successfully saved image reference for image ${i}`)
          }
        }
      }

      // Refresh products list
      await fetchProducts()
      setShowForm(false)
      resetForm()
    } catch (error: any) {
      console.error("Error in handleSubmit:", error)
      setError(`Error saving product: ${error.message}`)
      setDebugInfo(`Submit exception: ${error.stack}`)
      toast({
        title: "Error saving product",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Products</h2>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800 whitespace-pre-wrap">
            <strong>Debug Info:</strong> {debugInfo}
          </AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KES)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Premium quality materials&#10;Handcrafted with attention to detail&#10;Unique design"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications (Key: Value, one per line)</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Material: Premium ceramic&#10;Dimensions: 15cm x 8cm&#10;Weight: 1.8kg"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
                <Label htmlFor="in_stock">In Stock</Label>
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-xs text-gray-500">Add Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" multiple />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 5 images. First image will be the main product image.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
          <Button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images.find((img) => img.isMain)?.url || product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 truncate">{product.category}</p>
                <p className="mt-2 font-bold">KES {product.price.toLocaleString()}</p>
                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

