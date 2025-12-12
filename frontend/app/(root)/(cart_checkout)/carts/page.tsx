"use client"
import { CartProduct, CartProductCategory, CartProductDelete, CartProductImage, CartProductPrice, CartProductTitle, QuantityHandler } from "@/components/item-products";
import { useCarts } from "@/hooks/use-carts"
import { useDeleteCart } from "@/hooks/use-delete-cart";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2Icon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";


export default function CartsPage() {
  const { fetchNextPage, isFetchingNextPage, hasNextPage, data, isPending } = useCarts()
  const ref = useRef<HTMLDivElement | null>(null);
  const itemDelete = useDeleteCart();
  const allRows = data ? data.pages.flatMap(el => el.carts) : [];

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
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ])
  console.log(data);
  return (
    <div
      ref={ref}
      className="overflow-x-hidden space-y-6 w-full max-w-[1400px] m-auto px-2 md:px-8 h-[calc(100vh-(80px+162px+(16px*2)+(32px*2)))]"
    >
      <div className="pb-6 border-b border-b-neutral-04 grid grid-cols-[80px_2fr_1fr_1fr]">
        <span className="block font-medium">Product</span>
        <span className="max-md:hidden block font-medium col-start-3">Quantity</span>
        <span className="max-md:hidden block font-medium text-right col-start-4">Price</span>
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
              <CartProduct item={item} className="border-b pb-4 gap-4 grid md:gap-x-8 grid-cols-[80px_1fr_1fr] md:grid-cols-[80px_2fr_1fr_1fr]">
                <CartProductImage className="h-full row-span-3" />
                <CartProductTitle className="text-base" />
                <CartProductPrice className="text-base text-right md:self-center md:col-start-4 md:row-start-2" />
                <CartProductCategory className="max-sm:text-sm self-center md:col-start-2" />
                <CartProductDelete
                  className="max-md:justify-self-end md:justify-start md:px-0 md:col-start-2 w-fit"
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
                <QuantityHandler className="col-span-2 border rounded-md border-neutral-04 md:col-start-3 md:row-start-2" />
              </CartProduct>
            </div>
          )
        })}

      </div>
    </div>
  )
}
