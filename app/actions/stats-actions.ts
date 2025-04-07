"use server"

import { supabase } from "@/lib/supabase"

// Function to get vendor stats
export async function getVendorStats() {
  try {
    const { data, error } = await supabase.rpc("get_vendor_stats")

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

// Function to get mock stats (fallback)
export async function getMockStats() {
  // Mock data for stats
  const mockStats = {
    totalSales: 245750,
    totalOrders: 37,
    totalCustomers: 24,
    averageOrderValue: 6642,
    salesByMonth: [
      { month: "Jan", sales: 12500 },
      { month: "Feb", sales: 18700 },
      { month: "Mar", sales: 25300 },
      { month: "Apr", sales: 31200 },
      { month: "May", sales: 28900 },
      { month: "Jun", sales: 35800 },
      { month: "Jul", sales: 42100 },
      { month: "Aug", sales: 38600 },
      { month: "Sep", sales: 12650 },
    ],
    topProducts: [
      { id: "1", name: "Modern Ceramic Vase Set", sales: 42500 },
      { id: "2", name: "Blue Velvet Dining Chair", sales: 38200 },
      { id: "3", name: "Ergonomic Office Chair", sales: 35100 },
      { id: "4", name: "Porcelain Blue Vase", sales: 28700 },
      { id: "5", name: "Minimalist Coffee Table", sales: 25300 },
    ],
  }

  return { data: mockStats, error: null }
}

