"use client"
import { OrderSteps } from "@/components/order-steps";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

export default function CartCheckoutLayout({ children }: { children: ReactNode }) {
  const { getItem } = useLocalStorage();
  const router = useRouter()

  useEffect(() => {
    if (!getItem('token')) {
      setTimeout(() => toast.error('Unauthorized, login to access'));
      router.replace('/login');
    }
  }, [router])

  return (
    <div>
      This is cart checkout layout
      <OrderSteps />
      {children}
    </div>
  )
}
