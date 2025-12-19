import { fetchApi } from "@/lib/utils";
import { Product } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 15;
type productsResponse = { limit: number, products: Product[], skip: number, total: number };
export const useProducts = (
  sortBy: string = "title",
  order: string = "asc",
  category?: string,
  search?: string,
) => {
  return useInfiniteQuery({
    queryKey: ['products', category, sortBy, order, search],
    queryFn: async ({ pageParam }) => {
      let fetchString = `/products?limit=${LIMIT}&skip=${pageParam}&sortBy=${sortBy}&order=${order}`;

      if (!search && category !== "all") {
        fetchString += `&category=${category}`;
      }

      if (!category && search) {
        fetchString += `&search=${search}`;
      }


      const res = await fetchApi(fetchString);

      if (!res.ok) {
        throw new Error("Something went wrong");
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
