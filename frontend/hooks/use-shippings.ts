import { fetchWithAuth } from "@/lib/utils";
import { Shipping } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const useShippings = () => {
  return useQuery({
    queryKey: ['shippings'],
    queryFn: async () => {
      const res = await fetchWithAuth('/shippings');

      if (!res.ok) {
        throw new Error("Something went wrong please try again later");
      }

      return (await res.json()).data as Shipping[];
    }
  });
}
