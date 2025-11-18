"use client";
import { fetchWithAuth } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query"

export const useCartCount = () => {
  return useQuery({
    queryKey: ['cart_count'],
    refetchInterval: () => false,
    queryFn: async () => {
      const res = await fetchWithAuth('/carts/count');

      if (!res.ok) {
        throw new Error("Unable to fetch cart counts");
      }

      return (await res.json()).data as {
        cartCount: number
      }
    }
  })
}
