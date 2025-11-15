"use client";

import { ProductCard } from "@/components/product-card";
import { fetchApi } from "@/lib/utils";
import { ApiResponse, Product } from "@/types";
import { useQuery, } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ShopPage() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetchApi('/products');

      const json = await res.json() as ApiResponse<null>;

      if (!json.success) {
        throw new Error("testing");
      }

      const items = json.data as { limit: number, products: Product[], skip: number, total: number }
      return items;
    }
  })

  useEffect(() => {
    if (query.error) {
      toast.error("Something went wrong, Please try again later");
    }
  }, [query.error]);

  if (query.isPending) {
    return <div>Loading....</div>
  }

  if (query.error) {
    return <div>Error</div>
  }
  return (
    <div>
      {query.data?.products.map(el => (
        <ProductCard data={el} key={el.id} />
      ))}
      Hello from shop
    </div>
  )
}
