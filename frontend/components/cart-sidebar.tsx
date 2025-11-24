"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingBag } from "./ui/icons/shopping-bag";
import { useCartCount } from "@/hooks/use-cart-counts";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useCarts } from "@/hooks/use-carts";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ComponentProps, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CartProduct } from "./cart-products";
import { formatPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Checkbox } from "./ui/checkbox";
import { CartItem } from "@/types";
import { useDeleteCart } from "@/hooks/use-delete-cart";

const CartItems = ({ selected, setSelected }: {
  selected: number[],
  setSelected: Dispatch<SetStateAction<number[]>>
}) => {
  const { data, error, isFetchingNextPage, fetchNextPage, hasNextPage, isPending } = useCarts();
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const deleteCart = useDeleteCart();

  const carts = data ? data.pages.flatMap(page => page.carts) : [];

  const virtualizer = useVirtualizer(
    {
      count: hasNextPage ? carts.length + 1 : carts.length,
      getScrollElement: () => scrollableRef.current,
      estimateSize: () => 160,
      overscan: 5
    });

  const virtualItems = virtualizer.getVirtualItems();


  useEffect(() => {
    if (deleteCart.isSuccess) {
      setTimeout(() => toast.success("Cart items removed successfully"));
      setSelected([]);
    }

  }, [deleteCart.isSuccess]);

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
  console.log(selected);

  return (
    <div>
      {
        carts.length === 0 ?
          <span>Your cart is currently empty</span>
          :
          <>
            <div className="flex items-center justify-between px-6">
              <Checkbox
                checked={
                  (selected.length !== 0) && carts.length === selected.length
                }
                onCheckedChange={checked => {
                  checked ?
                    setSelected(carts.map(el => el.id))
                    :
                    setSelected([]);
                }}
              />
              {selected.length !== 0 &&
                <Button variant={"ghost"} size={"icon-sm"}
                  onClick={() => {
                    deleteCart.mutate({
                      ids: selected
                    })
                  }}
                >
                  {
                    deleteCart.isPending ?
                      <Loader2Icon className="animate-spin" />
                      :
                      <Trash2Icon className="stroke-destructive" />
                  }
                </Button>
              }
            </div>
            <div
              ref={scrollableRef}
              className="h-[60vh] px-2 sm:px-6 overflow-auto w-full"
            >
              <div className="relative overflow-hidden w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
                {virtualItems.map(item => {
                  const isLoaderRow = item.index > carts.length - 1;
                  const cart = carts[item.index];

                  if (isLoaderRow) return null;
                  if (!cart) return <div>Loading...</div>;

                  return (
                    <div key={item.key}
                      className="absolute flex gap-2 items-center top-0 left-0 w-full"
                      style={{
                        height: `${item.size}px`,
                        transform: `translateY(${item.start}px)`
                      }}>
                      <Checkbox
                        checked={selected.some(el => el === carts[item.index].id)}
                        onCheckedChange={checked => {
                          checked ? setSelected(prev => [
                            ...prev,
                            carts[item.index].id
                          ])
                            :
                            setSelected(prev => prev.filter(el => el !== carts[item.index].id))
                        }}
                      />
                      <CartProduct isSelected={selected.length !== 0} data={carts[item.index]} />
                    </div>
                  )
                })}
              </div>
            </div>
          </>

      }
    </div>
  )
}
export const CartSidebar = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const cartCount = useCartCount();
  const { data, isFetching } = useCarts(false);
  const carts = data ? data.pages.flatMap(page => page.carts).reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<number, CartItem>) : [];

  console.log(selected);
  useEffect(() => {
    let total = 0;

    selected.forEach(el => {
      total += (carts[el].quantity * carts[el].productData.price);
    });

    setTotal(total);
  }, [selected]);

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
        <CartItems selected={selected} setSelected={setSelected} />
        <SheetFooter className="gap-6">
          <div className="px-4 w-full items-center flex justify-between text-neutral-07">
            <span className="text-xl font-medium">Total</span>
            <span>{isFetching ?
              <Skeleton className="w-20 h-6" />
              : formatPrice(total)}</span>
          </div>
          <Button disabled={selected.length === 0} className=" w-full p-8">
            Checkout
          </Button>
          <Link href={'carts'} className="w-full text-center underline">View Cart</Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
