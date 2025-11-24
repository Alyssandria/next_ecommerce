import { fetchWithAuth } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddCart = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ['add_cart'],
    mutationFn: async ({ productID }: { productID: number }) => {
      const res = await fetchWithAuth('/carts', {
        method: "POST",
        body: JSON.stringify({
          quantity: 1,
          product_id: productID
        })
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      return await res.json();
    },

    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({
          queryKey: ['carts']
        }),
        client.invalidateQueries({
          queryKey: ['cart_count']
        }),
      ])
    }
  })
}
