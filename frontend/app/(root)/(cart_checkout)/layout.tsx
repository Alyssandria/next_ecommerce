import { OrderSteps } from "@/components/order-steps";
import { ReactNode } from "react";

export default function CartCheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      This is cart checkout layout
      <OrderSteps />
      {children}
    </div>
  )
}
