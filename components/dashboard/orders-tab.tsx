"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Eye, Package } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  created_at: string
  items: OrderItem[]
  shipping_address: {
    address: string
    city: string
    postal_code: string
    country: string
  }
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      if (!user) return

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_id,
          customer_name,
          customer_email,
          status,
          total,
          created_at,
          shipping_address,
          items:order_items(
            id,
            product_id,
            product_name,
            quantity,
            price
          )
        `)
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, status: Order["status"]) {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

      if (error) throw error

      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }

      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  function viewOrderDetails(order: Order) {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  function getStatusBadge(status: Order["status"]) {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-50">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't received any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">Customer:</span> {order.customer_name}
                    </p>
                    <p className="text-sm font-medium mt-2">KES {order.total.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    {order.status === "pending" && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, "processing")}>
                        Process Order
                      </Button>
                    )}
                    {order.status === "processing" && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, "shipped")}>
                        Mark as Shipped
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{selectedOrder.id.slice(0, 8)}</DialogTitle>
                <DialogDescription>Placed on {formatDate(selectedOrder.created_at)}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Status</h4>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <h4 className="font-medium text-right">Total</h4>
                    <p className="text-lg font-bold">KES {selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p>{selectedOrder.customer_name}</p>
                    <p>{selectedOrder.customer_email}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm space-y-1">
                    <p>{selectedOrder.shipping_address.address}</p>
                    <p>
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}
                    </p>
                    <p>{selectedOrder.shipping_address.country}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="border rounded-md divide-y">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-3 flex justify-between">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">KES {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    {selectedOrder.status === "pending" && (
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "processing")
                        }}
                      >
                        Process Order
                      </Button>
                    )}
                    {selectedOrder.status === "processing" && (
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "shipped")
                        }}
                      >
                        Mark as Shipped
                      </Button>
                    )}
                    {selectedOrder.status === "shipped" && (
                      <Button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, "delivered")
                        }}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                    {(selectedOrder.status === "pending" || selectedOrder.status === "processing") && (
                      <Button
                        variant="outline"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this order?")) {
                            updateOrderStatus(selectedOrder.id, "cancelled")
                          }
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

