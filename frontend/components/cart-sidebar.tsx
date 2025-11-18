"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingBag } from "./ui/icons/shopping-bag";
import { useCartCount } from "@/hooks/use-cart-counts";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useCarts } from "@/hooks/use-carts";

export const CartItems = () => {
  const cartItems = useCarts();

  if (cartItems.isPending) {
    return (
      <div>
      </div>
    )
  }

  return (
    <div>
    </div>
  )
}
export const CartSidebar = () => {
  const cartCount = useCartCount();

  if (cartCount.isError) {
    return <Link className="block ml-auto" href={'/login'}>Login</Link>
  }

  if (cartCount.isPending) {
    return <Loader2Icon className="ml-auto w-6 animate-spin" />
  }

  return (
    <Sheet>
      <SheetTrigger className={`flex items-center gap-2 ml-auto`}>
        <ShoppingBag />
        <span className="rounded-full bg-primary size-7 flex items-center justify-center text-secondary">{cartCount.data.cartCount}</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carts</SheetTitle>
          <SheetDescription className="sr-only">
            User Carts
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
