"use client";

import { ProductCard } from "@/components/product-card";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";
import { useProducts } from "@/hooks/use-products";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function ShopPage() {
  const { isFetchingNextPage, error, isPending, data, fetchNextPage, hasNextPage } = useProducts();
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const products = data ? data.pages.flatMap(page => page.products) : [];
  const virtualizer = useVirtualizer(
    {
      count: hasNextPage ? products.length + 1 : products.length,
      getScrollElement: () => scrollableRef.current,
      estimateSize: () => 550,
      overscan: 5
    });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (error) {
      setTimeout(() => toast.error("Something happened, please try again later"));
    }
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      hasNextPage && !isFetchingNextPage && lastItem.index === products.length
    ) {
      fetchNextPage();
    }
  }, [
    error,
    virtualItems,
    hasNextPage,
    products.length,
    isFetchingNextPage,
    fetchNextPage
  ]);


  if (isPending) {
    return <div>Loading....</div>
  }

  if (error) {
    return <div>Error</div>
  }


  return (
    <div
      ref={scrollableRef}
      className="max-h-screen overflow-y-auto"
    >
      <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(item => {
          const isLoaderRow = item.index >= products.length - 1;

          if (isLoaderRow) return null;

          return (
            <div key={item.key}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`
              }}>
              <ProductCard data={products[item.index]} onCartAdd={() => setTimeout(() => toast.success("Cart successfully added"))} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
