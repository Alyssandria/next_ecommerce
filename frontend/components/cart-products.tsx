"use client"
import { formatCase, formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useUpdateQuantity } from "@/hooks/use-update-quantity";
import { Loader2Icon, XIcon } from "lucide-react";
import { useDeleteCart } from "@/hooks/use-delete-cart";
import { toast } from "sonner";

export const CartProduct = ({ data, isSelected }: { data: CartItem, isSelected?: boolean }) => {
  const [quantity, setQuantity] = useState(data.quantity);
  const updateQuantity = useUpdateQuantity();
  const deleteCart = useDeleteCart();


  const handleQuantityButton = (op: number) => {
    setQuantity(prev => Math.max(1, prev + op));
    updateQuantity.mutate({ id: data.id, quantity: Math.max(1, quantity + op) });
  }

  useEffect(() => {
    if (deleteCart.isSuccess) {
      setTimeout(() => toast.success("Cart item deleted!"))
    }

  }, [deleteCart.isSuccess])


  const productData = data.productData;

  return (
    <div className="w-full flex gap-2">
      <div className="flex bg-[#F3F5F7] items-center justify-center">
        <Image src={productData.thumbnail} alt="Product Image" width={860} height={320} className="max-w-14 sm:max-w-20 object-center" />
      </div>
      <div className="flex flex-col gap-4 justify-between w-full">
        <div className="flex flex-wrap gap-2 justify-between w-full">
          <span className="block max-md:text-xs max-w-32 truncate w-full">{productData.title}</span>
          <span className="block font-medium max-md:text-xs">{formatPrice(productData.price)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="block text-xs text-neutral-04 truncate">{formatCase(productData.category)}</span>
          {!isSelected &&
            <Button variant={"ghost"}
              size={"icon-sm"}
              onClick={() => {
                deleteCart.mutate({
                  ids: [data.id]
                });
              }}
            >
              {deleteCart.isPending ?
                <Loader2Icon className="animate-spin" /> :
                <XIcon />
              }

            </Button>
          }
        </div>
        <div className="flex">
          <div className="flex justify-around items-center border border-neutral-04 w-full rounded-md px-2">
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
