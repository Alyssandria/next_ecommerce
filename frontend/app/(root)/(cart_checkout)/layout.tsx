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
    <div className="p-4">
      <div className="w-full flex justify-center items-center">
        <OrderSteps />
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="py-8 max-w-[1400px]">
          {children}
        </div>
      </div>
    </div>
  )
}
