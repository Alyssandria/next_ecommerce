import { fetchWithAuth } from "@/lib/utils";
import { CartItem } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query"

const LIMIT = 10;
export const useCarts = () => {
  return useInfiniteQuery({
    queryKey: ['carts'],
    queryFn: async ({ pageParam }) => {
      const res = await fetchWithAuth(`/carts?limit=${LIMIT}&skip=${pageParam}`, {
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error("Unable to fetch cart");
      }

      return (await res.json()).data as {
        total: number,
        skip: number,
        limit: number,
        carts: CartItem[]
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _) => {
      const nextSkip = lastPage.skip + lastPage.limit;

      if (nextSkip >= lastPage.total) return undefined

      return nextSkip;
    }
  })
}
