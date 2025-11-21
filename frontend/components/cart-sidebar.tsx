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
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CartProduct } from "./cart-products";

const CartItems = () => {
  const { data, error, isFetchingNextPage, fetchNextPage, hasNextPage, isPending } = useCarts();
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const carts = data ? data.pages.flatMap(page => page.carts) : [];

  const virtualizer = useVirtualizer(
    {
      count: hasNextPage ? carts.length + 1 : carts.length,
      getScrollElement: () => scrollableRef.current,
      estimateSize: () => 150,
      overscan: 5
    });

  const virtualItems = virtualizer.getVirtualItems();


  useEffect(() => {
    if (error) {
      setTimeout(() => toast.error("Something happened, please try again later"));
    }
    const lastItem = virtualItems.at(-1);

    if (!lastItem) return;

    if (
      hasNextPage && !isFetchingNextPage && lastItem.index === carts.length
    ) {
      fetchNextPage();
    }
  }, [
    error,
    virtualItems,
    hasNextPage,
    carts.length,
    isFetchingNextPage,
    fetchNextPage
  ]);
  if (isPending) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div>
        Error Page
      </div>
    )
  }

  return (
    <div
      ref={scrollableRef}
      className="h-[80vh] overflow-auto w-full"
    >
      <div className="relative overflow-hidden w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(item => {
          const isLoaderRow = item.index > carts.length - 1;
          const cart = carts[item.index];

          if (isLoaderRow) return null;
          if (!cart) return <div>Loading...</div>;

          return (
            <>
              <div key={item.key}
                className="absolute border-b top-0 left-0 w-full"
                style={{
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px)`
                }}>
                <CartProduct data={carts[item.index]} />
              </div>
            </>
          )
        })}
      </div>
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
      <SheetContent className="overflow-x-hidden">
        <SheetHeader>
          <SheetTitle>Carts</SheetTitle>
          <SheetDescription className="sr-only">
            User Carts
          </SheetDescription>
        </SheetHeader>
        <CartItems />
      </SheetContent>
    </Sheet>
  )
}
