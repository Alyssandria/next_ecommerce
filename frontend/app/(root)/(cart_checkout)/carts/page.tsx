"use client"
import { CartProduct, CartProductCategory, CartProductDelete, CartProductImage, CartProductPrice, CartProductSubtotal, CartProductTitle, QuantityHandler } from "@/components/item-products";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCarts } from "@/hooks/use-carts"
import { useDeleteCart } from "@/hooks/use-delete-cart";
import { useUpdateQuantity } from "@/hooks/use-update-quantity";
import { cn, formatPrice } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2Icon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";


export default function CartsPage() {
  const { fetchNextPage, isFetchingNextPage, hasNextPage, data, isPending } = useCarts()
  const ref = useRef<HTMLDivElement | null>(null);
  const itemDelete = useDeleteCart();
  const allRows = data ? data.pages.flatMap(el => el.carts) : [];
  const [total, setTotal] = useState<number>(0);
  const updateQuantity = useUpdateQuantity();

  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    let total = 0;

    selected.forEach(el => {
      const item = allRows.find(x => x.productData.id === el)!
      total = Number((total + item.quantity * item.productData.price).toFixed(2))
    })

    setTotal(total);

    console.log(total);

  }, [selected, allRows])


  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 170,
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }

  }, [
    hasNextPage,
    fetchNextPage,
    allRows,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ])
  console.log(selected);
  return (
    <div className="flex gap-16 flex-col lg:flex-row w-full max-w-[1400px] m-auto h-[calc(100vh-(80px+162px+(16px*2)+(32px*2)))]">
      <div
        ref={ref}
        className="flex-2/6 overflow-x-hidden space-y-6 w-full  px-2 md:px-8"
      >
        <div className="gap-4 pb-6 border-b border-b-neutral-04 grid grid-cols-[20px_80px_2fr_1fr_1fr_1fr]">
          <Checkbox
            checked={allRows.length !== 0 && (selected.length === allRows.length)}
            onCheckedChange={(checked) => {
              checked ? setSelected(allRows.map(el => el.productData.id)) : setSelected([])
            }}
            className="self-center"
          />
          <span className="block font-medium">Product</span>
          <span className="max-md:hidden block font-medium col-start-4">Quantity</span>
          <span className="max-md:hidden block font-medium text-center col-start-5">Price</span>
          <span className="hidden md:block font-medium text-right col-start-6">Subtotal</span>
        </div>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {isPending &&
            <div className="h-full bg-amber-300 w-full">
              <Loader2Icon className="animate-spin" />
            </div>
          }
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allRows.length - 1
            const item = allRows[virtualRow.index]

            if (isLoaderRow) return;

            return (
              <div
                key={virtualRow.index}
                className="w-full absolute top-0 left-0"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <CartProduct item={item} className="border-b pb-4 gap-4 grid md:gap-x-8 grid-cols-[20px_80px_1fr_1fr] md:grid-cols-[20px_80px_2fr_1fr_1fr_1fr]">
                  <Checkbox
                    checked={selected.some(el => el === item.productData.id)}
                    onCheckedChange={(checked) => {
                      checked ? setSelected(prev => [...prev, item.productData.id]) : setSelected(prev => prev.filter(el => el !== item.productData.id))
                    }}
                  />
                  <CartProductImage className="h-full row-span-3" />
                  <CartProductTitle className="text-base" />
                  <CartProductPrice className="text-base text-right md:text-center md:self-center md:col-start-5 md:row-start-2" />
                  <CartProductSubtotal className="max-md:hidden text-base text-right md:self-center md:col-start-6 md:row-start-2" />
                  <CartProductCategory className="max-sm:text-sm self-center col-start-3" />
                  <CartProductDelete
                    className="max-md:justify-self-end md:justify-start md:px-0 col-start-4 md:col-start-3 w-fit"
                    onDelete={() => {
                      itemDelete.mutate({
                        ids: [item.id]
                      });

                    }}
                  >
                    {itemDelete.isPending ?
                      <Loader2Icon className="animate-spin" />
                      :
                      <div className="flex gap-2 items-center">
                        <XIcon />
                        <span className="max-md:hidden">Remove</span>
                      </div>
                    }
                  </CartProductDelete>
                  <QuantityHandler
                    onQuantityUpdate={(id, qty) => {
                      updateQuantity.mutate({ id, quantity: qty });
                    }}
                    className="max-md:col-span-2 border rounded-md border-neutral-04 md:col-start-4 md:row-start-2" />
                </CartProduct>
              </div>
            )
          })}

        </div>
      </div>


      <div className="flex-1">
        <Card className="border-neutral-04">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Cart summary</CardTitle>
          </CardHeader>
          <CardContent className="gap-8 flex flex-col">
            <div className="w-full flex gap-4 border border-[#121212] p-4 rounded-md bg-neutral-02">
              <div className="size-6 border flex justify-center border-[#121212] items-center rounded-full">
                <div className="size-3 bg-black rounded-full" />
              </div>
              <div className="w-full flex justify-between">
                <span className="block">Free Shipping</span>
                <span className="block">{formatPrice(0)}</span>
              </div>

            </div>
            <div className="flex justify-between text-xl font-medium">
              <span className="block">Total</span>
              {updateQuantity.isPending ?
                <Loader2Icon className="animate-spin" />
                :
                <span className="block">{formatPrice(total)}</span>
              }
            </div>
          </CardContent>
          <CardFooter>
            {selected.length === 0 ?
              <Button
                disabled={true}
                className="hover:cursor-not-allowed w-full p-6"
              >Checkout</Button>
              :
              <Link
                className="w-full p-4 rounded-lg text-center text-white bg-neutral-07"
                href={"/checkout?" + selected.map(el => `ids=${el}`).join("&")}
              >
                Checkout
              </Link>
            }
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
