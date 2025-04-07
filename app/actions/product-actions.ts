"use server"

import { supabase } from "@/lib/supabase"

// Function to fetch vendor products
export async function getVendorProducts() {
  try {
    const { data, error } = await supabase.rpc("get_vendor_products")

    if (error) {
      console.error("Error in get_vendor_products RPC:", error)
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Exception in getVendorProducts:", error)
    return { data: null, error }
  }
}

// Function to create a vendor product - UPDATED
export async function createVendorProduct(productData: any) {
  try {
    // Make sure we're using email instead of vendor_email
    const cleanedData = { ...productData }
    if (cleanedData.vendor_email) {
      cleanedData.email = cleanedData.vendor_email
      delete cleanedData.vendor_email
    }

    // Log the data being sent for debugging
    console.log("Creating product with data:", JSON.stringify(cleanedData))

    const { data, error } = await supabase.rpc("create_vendor_product", {
      p_data: cleanedData,
    })

    if (error) {
      console.error("Error in create_vendor_product RPC:", error)
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Exception in createVendorProduct:", error)
    return { data: null, error }
  }
}

// Function to update a vendor product
export async function updateVendorProduct(productId: string, productData: any) {
  try {
    // Make sure we're using email instead of vendor_email
    const cleanedData = { ...productData }
    if (cleanedData.vendor_email) {
      cleanedData.email = cleanedData.vendor_email
      delete cleanedData.vendor_email
    }

    const { data, error } = await supabase.rpc("update_vendor_product", {
      p_id: productId,
      p_data: cleanedData,
    })

    if (error) {
      console.error("Error in update_vendor_product RPC:", error)
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Exception in updateVendorProduct:", error)
    return { data: null, error }
  }
}

// Function to delete a vendor product
export async function deleteVendorProduct(productId: string) {
  try {
    const { data, error } = await supabase.rpc("delete_vendor_product", {
      product_id: productId,
    })

    if (error) {
      console.error("Error in delete_vendor_product RPC:", error)
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Exception in deleteVendorProduct:", error)
    return { data: null, error }
  }
}

// Function to add a product image - FIXED
export async function addProductImage(productId: string, imageUrl: string, isMain: boolean) {
  try {
    // Direct insert instead of using RPC to avoid potential issues
    const { data, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: imageUrl,
        is_main: isMain,
      })
      .select()

    if (error) {
      console.error("Error inserting product image:", error)
      throw error
    }

    return { data: data?.[0]?.id, error: null }
  } catch (error: any) {
    console.error("Exception in addProductImage:", error)
    return { data: null, error }
  }
}

// Function to upload an image to storage - FIXED
export async function uploadProductImage(productId: string, file: File) {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${productId}/${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // Log the file details
    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`)
    console.log(`Target path: product-images/${filePath}`)

    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading to storage:", uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

    console.log("Upload successful, public URL:", urlData.publicUrl)

    return { url: urlData.publicUrl, error: null }
  } catch (error: any) {
    console.error("Exception in uploadProductImage:", error)
    return { url: null, error }
  }
}

// Function to fetch product images
export async function getProductImages(productId: string) {
  try {
    const { data, error } = await supabase
      .from("product_images")
      .select("id, url, is_main")
      .eq("product_id", productId)
      .order("is_main", { ascending: false })

    if (error) {
      console.error("Error fetching product images:", error)
      throw error
    }

    return { data: data || [], error: null }
  } catch (error: any) {
    console.error("Exception in getProductImages:", error)
    return { data: [], error }
  }
}

