"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Menu, User, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const [showBlackmarket, setShowBlackmarket] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleUserIconClick = () => {
    if (loading) return // Don't do anything while loading

    if (user) {
      // If user is logged in, go directly to profile or dashboard
      if (user.role === "vendor") {
        router.push("/dashboard")
      } else {
        router.push("/profile")
      }
    } else {
      // If not logged in, go to sign in page
      router.push("/auth/signin")
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white transition-all duration-200",
        isScrolled && "shadow-md",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-10">
                <Link
                  href="/"
                  className={cn(
                    "text-lg font-medium hover:text-green-600 transition-colors",
                    pathname === "/" && "text-green-600 font-bold",
                  )}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className={cn(
                    "text-lg font-medium hover:text-green-600 transition-colors",
                    (pathname === "/shop" || pathname.startsWith("/shop?")) && "text-green-600 font-bold",
                  )}
                >
                  Shop
                </Link>
                <Link
                  href="/categories"
                  className={cn(
                    "text-lg font-medium hover:text-green-600 transition-colors",
                    pathname === "/categories" && "text-green-600 font-bold",
                  )}
                >
                  Categories
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-lg font-medium hover:text-green-600 transition-colors",
                    pathname === "/about" && "text-green-600 font-bold",
                  )}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "text-lg font-medium hover:text-green-600 transition-colors",
                    pathname === "/contact" && "text-green-600 font-bold",
                  )}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="NewSilkroad Logo" width={32} height={32} className="hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-green-600">NewSilkroad</span>
              <div className="relative cursor-pointer" onClick={() => setShowBlackmarket(!showBlackmarket)}>
                {showBlackmarket ? (
                  <span className="text-xs text-gray-700">blackmarket</span>
                ) : (
                  <div className="h-3 w-20 bg-gray-200 overflow-hidden relative">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-green-600 animate-pulse"
                        style={{
                          left: `${i * 10 + Math.random() * 5}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium hover:text-green-600 transition-colors",
              pathname === "/" && "text-green-600 font-bold",
            )}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={cn(
              "text-sm font-medium hover:text-green-600 transition-colors",
              (pathname === "/shop" || pathname.startsWith("/shop?")) && "text-green-600 font-bold",
            )}
          >
            Shop
          </Link>
          <Link
            href="/categories"
            className={cn(
              "text-sm font-medium hover:text-green-600 transition-colors",
              pathname === "/categories" && "text-green-600 font-bold",
            )}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium hover:text-green-600 transition-colors",
              pathname === "/about" && "text-green-600 font-bold",
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium hover:text-green-600 transition-colors",
              pathname === "/contact" && "text-green-600 font-bold",
            )}
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <form className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="w-[200px] pl-8 md:w-[300px]" />
          </form>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                3
              </span>
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {loading ? (
            // Show loading state
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || ""} alt={user.full_name || user.email} />
                    <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => (user.role === "vendor" ? router.push("/dashboard") : router.push("/profile"))}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.role === "vendor" ? "Dashboard" : "Profile"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" onClick={handleUserIconClick}>
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

