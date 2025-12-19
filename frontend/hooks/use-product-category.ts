import { fetchApi } from "@/lib/utils"
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const useProductCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const items = await fetchApi('/products/categories');

      if (!items.ok) {
        throw new Error("Something went wrong");
      }

      return (await items.json()).data as Category[];
    }
  })
}
