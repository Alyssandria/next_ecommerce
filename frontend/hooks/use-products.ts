import { fetchApi } from "@/lib/utils";
import { Product } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 15;
type productsResponse = { limit: number, products: Product[], skip: number, total: number };
export const useProducts = () => {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam }) => {
      const res = await fetchApi(`/products?limit=${LIMIT}&skip=${pageParam}`);

      if (!res.ok) {
        throw new Error("testing");
      }

      const json = await res.json();

      const items = json.data as productsResponse
      return items;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _) => {
      const nextSkip = lastPage.skip + lastPage.limit;

      if (nextSkip >= lastPage.total) return undefined

      return nextSkip;
    }
  })
}
