import { useQuery } from "@tanstack/react-query"

export const useCarts = () => {
  return useQuery({
    queryKey: ['get_carts'],
    queryFn: async () => {
    }
  })
}
