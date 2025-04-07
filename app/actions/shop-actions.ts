"use server"

import { supabase } from "@/lib/supabase"
import { allProducts as demoProducts } from "@/data/products"

// Function to fetch all products (both from database and demo products)
export async function getAllProducts() {
  try {
    // Use the get_shop_products function instead of direct query
    const { data: dbProducts, error } = await supabase.rpc("get_shop_products")

    if (error) {
      console.error("Error fetching products:", error)
      throw error
    }

    console.log(`Fetched ${dbProducts?.length || 0} products from database`)

    // Transform the DB products to match the expected format
    const transformedDbProducts = (dbProducts || []).map((product) => {
      // Parse product_images if it's a string, otherwise use as is
      const images =
        typeof product.product_images === "string" ? JSON.parse(product.product_images) : product.product_images || []

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        features: product.features || [],
        specifications: product.specifications || {},
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        vendor_id: product.vendor_id,
        vendor_email: product.email,
        images: images,
        image: images.length > 0 ? images.find((img: any) => img.is_main)?.url || images[0].url : "/placeholder.svg",
      }
    })

    // Transform demo products to match the same format
    const transformedDemoProducts = demoProducts.map((product) => ({
      ...product,
      id: `demo-${product.id}`,
      vendor_id: "demo",
      vendor_email: "demo@newsilkroad.co.ke",
    }))

    // Combine both sets of products
    const combinedProducts = [...transformedDbProducts, ...transformedDemoProducts]

    return { data: combinedProducts, error: null }
  } catch (error: any) {
    console.error("Error in getAllProducts:", error)

    // Use demo products as fallback
    const fallbackProducts = demoProducts.map((product) => ({
      ...product,
      id: `demo-${product.id}`,
      vendor_id: "demo",
      vendor_email: "demo@newsilkroad.co.ke",
    }))

    return { data: fallbackProducts, error }
  }
}

