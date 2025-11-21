"use client"
import { formatCase, formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";
import Image from "next/image";
import { ComponentProps, useState } from "react";
import { Button } from "./ui/button";
import { useUpdateQuantity } from "@/hooks/use-update-quantity";

export const CartProduct = ({ data }: { data: CartItem } & ComponentProps<"div">) => {
  const [quantity, setQuantity] = useState(data.quantity);
  const updateQuantity = useUpdateQuantity();


  const handleQuantityButton = (op: number) => {
    setQuantity(prev => Math.max(1, prev + op));
    updateQuantity.mutate({ id: data.id, quantity: Math.max(1, quantity + op) });
  }


  const productData = data.productData;

  return (
    <div className="w-full flex gap-2 px-4">
      <div className="flex bg-[#F3F5F7] items-center justify-center">
        <Image src={productData.thumbnail} alt="Product Image" width={860} height={320} className="max-w-20 object-center" />
      </div>
      <div className="flex flex-col gap-4 justify-between w-full">
        <div className="flex flex-wrap gap-2 justify-between w-full">
          <span className="block max-md:text-xs max-w-32 truncate w-full">{productData.title}</span>
          <span className="block font-medium max-md:text-xs">{formatPrice(productData.price)}</span>
        </div>
        <div>
          <span className="block text-xs text-neutral-04 truncate">{formatCase(productData.category)}</span>
        </div>
        <div>
          <div className="flex gap-2 items-center border border-neutral-04 w-fit rounded-md px-2">
            <Button onClick={() => {
              handleQuantityButton(-1);
            }}
              className="p-0 text-xs font-bold bg-transparent text-primary hover:bg-transparent">
              -
            </Button>
            <span className="text-xs">{quantity}</span>
            <Button
              onClick={() => {
                handleQuantityButton(1);
              }}
              className="p-0 text-xs bg-transparent text-primary hover:bg-transparent">
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

}
