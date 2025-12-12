"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useOrderCapture } from "@/hooks/use-order-capture";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { OrderProduct } from "@/types";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"
import { ComponentProps, useEffect, useRef } from "react";
import { toast } from "sonner";

const ProductImage = ({ className, data, ...props }: { data: OrderProduct } & ComponentProps<"div">) => {
  return (
    <div className={cn("relative w-20 h-24 bg-neutral-02", className)} {...props}>
      <Image
        src={data.product_data.thumbnail}
        width={100}
        height={100}
        className="object-cover"
        alt="Ordered Product Image"
      />
      <div className="size-5 absolute top-[-10%] right-[-15%] bg-neutral-07 rounded-full flex items-center justify-center text-white">
        <span className="block text-xs">{data.quantity}</span>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  const token = useSearchParams().get("token");
  const order = useOrderCapture(token ? token : "");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setTimeout(() => toast.error("Order token not found"));
      router.replace('/carts');
      return;
    }
  }, []);

  useEffect(() => {
    if (!order.isPending) {
      setTimeout(() => toast.success("Order completed!"));
    }

  }, [order.isPending])

  return (
    // !!! HANDLE INVALID/NULL TOKEN SEARCH PARAMS
    <div className="w-full max-w-[738px]">
      <Card className="rounded-sm shadow-2xl border-neutral-03 gap-10 md:p-10">
        <CardHeader className="gap-4">
          <span className="text-muted-foreground font-medium md:text-center md:text-2xl">Thank You!🎉</span>
          <CardTitle className="text-4xl font-medium text-neutral-06 md:text-center md:text-5xl">Your order has been recieved</CardTitle>
        </CardHeader>
        <CardContent className={cn("min-h-[424px] flex items-center justify-center")}>
          {
            order.isPending ?
              <Loader2Icon className="animate-spin" />
              :
              <div className="w-full flex flex-col gap-10">
                <div className="flex w-full justify-center gap-8 flex-wrap md:w-3/5 md:m-auto">
                  {order.data?.products.map(el => (
                    <ProductImage data={el} />
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between md:m-auto md:w-3/5 max-md:border-b max-md:flex-col pb-4 flex-wrap gap-2">
                    <span className="block flex-1 text-muted-foreground font-medium">Order Number:</span>
                    <span className="block flex-1 ">#{order.data?.order_no}</span>
                  </div>
                  <div className="flex justify-between md:m-auto md:w-3/5 max-md:border-b max-md:flex-col pb-4 flex-wrap gap-2">
                    <span className="block flex-1 text-muted-foreground font-medium">Date:</span>
                    <span className="block flex-1 ">{formatDate(order.data!.date)}</span>
                  </div>
                  <div className="flex justify-between md:m-auto md:w-3/5 max-md:border-b max-md:flex-col pb-4 flex-wrap gap-2">
                    <span className="block flex-1 text-muted-foreground font-medium">Total:</span>
                    <span className="block flex-1 ">{formatPrice(order.data!.total)}</span>
                  </div>
                  <div className="flex justify-between md:m-auto md:w-3/5 max-md:border-b max-md:flex-col pb-4 flex-wrap gap-2">
                    <span className="block flex-1 text-muted-foreground font-medium">Payment Method:</span>
                    <span className="block flex-1 ">Paypal</span>
                  </div>
                </div>
              </div>
          }
        </CardContent>
        <CardFooter>
          <Link href={'/orders'} className="p-4 px-8 m-auto bg-primary text-white rounded-4xl">Purchase History</Link>
        </CardFooter>
      </Card>
    </div>
  )
}
