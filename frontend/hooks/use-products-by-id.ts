import { fetchWithAuth } from "@/lib/utils"
import { CartItem, Product } from "@/types";
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

export const useProductsByIds = (ids: number[]) => {

  return useQuery({
    queryKey: ['products_by_id'],
    queryFn: async () => {
      const res = await fetchWithAuth(`/products/checkout?${ids.map(el => `ids=${el}`).join('&')}`);

      if (!res.ok) {
        setTimeout(() => toast.error("Something went wrong, please try again later"));
        throw new Error("Something went wrong");
      }

      return await res.json() as {
        success: true,
        data: CartItem[]
      };
    }
  })

}
