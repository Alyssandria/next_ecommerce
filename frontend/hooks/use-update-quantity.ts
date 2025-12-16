import { fetchWithAuth } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update_quantity'],
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      const res = await fetchWithAuth(`carts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          quantity
        })
      })

      if (!res.ok) {
        throw new Error("Error");
      }

      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['carts'] });
    }
  })
}
