import { fetchWithAuth } from "@/lib/utils";
import { ShippingValidator } from "@/lib/validations/shippingValidators";
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

export const useShippings = () => {
  return useQuery({
    queryKey: ['shippings'],
    queryFn: async () => {
      const res = await fetchWithAuth('/shippings');

      console.log(res);
      if (!res.ok) {
        setTimeout(() => toast.error("Something went wrong, try again later"));
        throw new Error("Something went wrong please try again later");

      }

      return await res.json() as ShippingValidator;
    }
  });
}
