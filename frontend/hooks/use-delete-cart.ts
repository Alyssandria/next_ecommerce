import { fetchWithAuth } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteCart = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ['delete_cart'],
    mutationFn: async ({ ids }: { ids: number[] }) => {
      const idsString = ids.map(el => `ids=${el}`).join("&");
      const res = await fetchWithAuth(`carts?${idsString}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("There's some error in the request");
      }

      return await res.json();
    },

    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['carts'] }),
        client.invalidateQueries({ queryKey: ['cart_count'] }),
      ]);
    }
  })
}
