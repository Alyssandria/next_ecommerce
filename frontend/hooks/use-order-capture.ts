import { fetchWithAuth } from "@/lib/utils";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const useOrderCapture = (token: string) => {
  return useQuery({
    queryKey: ['order_capture'],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `/payments/capture/${token}`,
        {
          method: "POST",
        }
      );

      if (!response.ok && response.status !== 401) {
        throw new Error("Something happened, try again later");
      }

      return (await response.json()).data as Order;
    }
  })

}
