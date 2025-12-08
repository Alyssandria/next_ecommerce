import { fetchWithAuth } from "@/lib/utils"
import { ShippingValidator } from "@/lib/validations/shippingValidators"
import { Shipping } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateShippings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: ShippingValidator }) => {
      const res = await fetchWithAuth('/shippings', {
        method: "POST",
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      return (await res.json()).data as Shipping;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['shippings'],
      })
    }
  })

}
