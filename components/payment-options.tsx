"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

interface PaymentOptionsProps {
  totalAmount: number
}

export function PaymentOptions({ totalAmount }: PaymentOptionsProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleMpesaPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)

      // Show centered toast notification
      toast({
        title: "Payment Initiated",
        description: `M-Pesa payment request sent to ${phoneNumber} for KES ${totalAmount.toLocaleString()}`,
        variant: "success",
      })
    }, 2000)
  }

  return (
    <Tabs defaultValue="mpesa" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
        <TabsTrigger value="paypal">PayPal</TabsTrigger>
      </TabsList>
      <ScrollArea className="max-h-[300px]">
        <TabsContent value="mpesa">
          <Card>
            <CardHeader>
              <CardTitle>Pay with M-Pesa</CardTitle>
              <CardDescription>Enter your phone number to receive payment prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMpesaPayment}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="07XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  You will receive a prompt on your phone to complete the payment of KES {totalAmount.toLocaleString()}
                </div>
                <Button type="submit" className="mt-4 w-full" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay KES ${totalAmount.toLocaleString()}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paypal">
          <Card>
            <CardHeader>
              <CardTitle>Pay with PayPal</CardTitle>
              <CardDescription>Secure payment via PayPal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-12 bg-[#0070ba] rounded flex items-center justify-center text-white font-bold">
                  PayPal
                </div>
              </div>
              <div className="text-sm text-gray-500 text-center">
                You will be redirected to PayPal to complete your payment of KES {totalAmount.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  toast({
                    title: "PayPal Checkout",
                    description: `You are being redirected to PayPal to complete your payment of KES ${totalAmount.toLocaleString()}`,
                    variant: "success",
                  })
                }}
              >
                Proceed to PayPal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

