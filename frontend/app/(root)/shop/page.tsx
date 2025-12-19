"use client";

import { ProductCard } from "@/components/product-card";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { useProducts } from "@/hooks/use-products";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { ChevronDown, Columns2, Grid3x3, Loader2Icon, Rows2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProductCategories } from "@/hooks/use-product-category";
import Link from "next/link";
import { Category } from "@/types";
import { keyof } from "zod";


const COLUMNS = {
  1: {
    COLUMN_COUNT: 1,
    ROW_HEIGHT: 443,
    CLASSNAME: "grid-cols-1",
  },
  2: {
    COLUMN_COUNT: 2,
    ROW_HEIGHT: 443,
    CLASSNAME: "grid-cols-2",
  },
  3: {
    COLUMN_COUNT: 3,
    ROW_HEIGHT: 443,
    CLASSNAME: "grid-cols-3",
  },
} as const;


const SORT_OPTIONS: {
  id: number,
  label: string,
  sortBy: string,
  order: "asc" | "desc",
}[] = [
  { id: 1, label: "Name: A–Z", sortBy: "title", order: "asc" },
  { id: 2, label: "Name: Z–A", sortBy: "title", order: "desc" },
  { id: 3, label: "Price: Low to High", sortBy: "price", order: "asc" },
  { id: 4, label: "Price: High to Low", sortBy: "price", order: "desc" },
] as const;

export default function ShopPage() {
  const categories = useProductCategories();
  const [category, setCategory] = useState<Category>({ name: "All Products", slug: "all" });

  const [sortOptions, setSortOptions] = useState<typeof SORT_OPTIONS[0]>(SORT_OPTIONS[0]);
  const {
    data,
    error,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useProducts(sortOptions.sortBy, sortOptions.order, category.slug);


  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const isTablet = useMediaQuery('(min-width: 48rem)');
  const [columns, setColumns] = useState<keyof typeof COLUMNS>(1);

  const products = useMemo(
    () => (data ? data.pages.flatMap(page => page.products) : []),
    [data]
  );

  const { COLUMN_COUNT, ROW_HEIGHT, CLASSNAME } = COLUMNS[columns];

  const rowCount = Math.ceil(products.length / COLUMN_COUNT);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rowCount + 1 : rowCount,
    getScrollElement: () => scrollableRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (isTablet) {
      setColumns(2);
    } else {
      setColumns(1)
    }

  }, [isTablet])
  useEffect(() => {
    if (!scrollableRef.current) return;
    rowVirtualizer.measure();
  }, [columns]);

  useEffect(() => {
    const lastRow = virtualRows.at(-1);
    if (!lastRow) return;

    if (
      hasNextPage &&
      !isFetchingNextPage &&
      lastRow.index >= rowCount - 1
    ) {
      fetchNextPage();
    }
  }, [
    virtualRows,
    hasNextPage,
    isFetchingNextPage,
    rowCount,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (error) {
      toast.error("Something happened, please try again later");
    }
  }, [error]);


  return (
    <div className="p-4 md:p-8 flex flex-col gap-4 max-w-[1440px] md:gap-10 m-auto">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex justify-between items-center py-4 border-b border-t border-neutral-03">
          <div className="flex gap-2 items-center">
            <SlidersHorizontal />
            <span className="block text-lg font-medium">Filter</span>
          </div>

          <ButtonGroup className="justify-self-end md:col-start-4 md:row-start-1">
            <Button variant={"outline"}
              className={cn(
                "max-md:hidden rounded-none",
                columns === 3 && "bg-neutral-03"
              )}
              onClick={() => setColumns(3)}
            >
              <Grid3x3 className="border-none stroke-white fill-neutral-07" />
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant={"outline"}
              className={cn(
                "max-sm:hidden rounded-none",
                columns === 2 && "bg-neutral-03"
              )}
              onClick={() => setColumns(2)}>
              <Columns2 className="border-none stroke-white fill-neutral-07" />
            </Button>
            <Button
              variant={"outline"}
              className={cn(
                "md:hidden rounded-none",
                columns === 1 && "bg-neutral-03"
              )}
              onClick={() => setColumns(1)}>

              <Rows2 className="border-none stroke-white fill-neutral-07" />
            </Button>
            <ButtonGroupSeparator />
          </ButtonGroup>
        </div>

        <div className="flex items-center justify-between">
          {isTablet ?
            <span className="block text-lg font-medium md:col-start-2">{category.name}</span>
            :
            <Dialog>
              <DialogTrigger className="flex-1 flex w-fit gap-2 items-center">
                <span className="block font-medium text-lg">Living Room</span>
                <ChevronDown />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          }

          <div className="flex items-center gap-2">
            <span className="block text-lg">Sort By</span>
            <Select
              value={String(sortOptions.id)}
              onValueChange={(val) => {
                setSortOptions(SORT_OPTIONS.find(el => Number(val) === el.id)!);
              }}
            >
              <SelectTrigger className="w-fit border-none shadow-none flex justify-end [&>span]:text-neutral-04 [&>span]:text-base hover:cursor-pointer">
                <SelectValue placeholder="Sort By" className="text-primary" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(el => (
                  <SelectItem value={String(el.id)}>{el.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-8">
        <div className="flex-1 max-md:hidden">
          <div className="flex flex-col gap-4">
            <span className="block text-lg font-medium">Categories</span>
            <ScrollArea className=" max-h-40 overflow-y-auto">
              <div className="flex flex-col gap-2">
                <Link href={{
                  pathname: "/shop"
                }}
                  onClick={() => {
                    setCategory({
                      name: "All Products",
                      slug: "all"
                    })
                  }}
                  className={
                    cn(
                      "block w-fit text-muted-foreground",
                      category.slug === "all" && "border-b-2 border-primary text-primary"
                    )
                  }
                >
                  <span>All Products</span>
                </Link>
                {categories.data?.map(el => (
                  <Link href={{
                    pathname: "/shop"
                  }}
                    onClick={() => {
                      setCategory(el)
                    }}
                    className={
                      cn(
                        "block w-fit text-muted-foreground",
                        category.slug === el.slug && "border-b-2 border-primary text-primary"
                      )
                    }
                  >
                    <span>{el.name}</span>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {isPending && <Loader2Icon className="animate-spin" />}
        <div
          ref={scrollableRef}
          className="flex-4/6 h-[calc(100vh-80px)] overflow-y-auto"
        >
          <div
            className="relative w-full"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {virtualRows.map(row => {
              const startIndex = row.index * COLUMN_COUNT;
              const rowProducts = products.slice(
                startIndex,
                startIndex + COLUMN_COUNT
              );

              const isLoaderRow = row.index >= rowCount;

              return (
                <div
                  key={row.key}
                  className={`absolute left-0 top-0 w-full ${row.index}`}
                  style={{
                    height: `${row.size}px`,
                    transform: `translateY(${row.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-muted-foreground">
                        Loading more...
                      </span>
                    </div>
                  ) : (
                    <div className={`grid ${CLASSNAME} gap-4 h-full place-items-center pb-10`}>
                      {rowProducts.map(product => (
                        <ProductCard
                          className="h-full"
                          key={product.id}
                          data={product}
                          onCartAdd={() =>
                            toast.success("Cart successfully added")
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div >
  );
}
