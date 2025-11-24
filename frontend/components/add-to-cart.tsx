"use client";
import { ComponentProps, useEffect } from "react";
import { Button } from "./ui/button"
import { fetchWithAuth } from "@/lib/utils";
import { toast } from "sonner";
import { useAddCart } from "@/hooks/use-add-cart";

interface AddToCartProps extends ComponentProps<typeof Button> {
  productID: number,
  onCartAdd?: () => void;
}
export const AddToCart = ({ productID, children, onCartAdd }: AddToCartProps) => {
  const addCart = useAddCart();

  useEffect(() => {
    if (addCart.isSuccess) {
      onCartAdd?.();
    }
  }, [addCart.isSuccess]);

  return (
    <Button
      type="button"
      className="w-full p-6"
      onClick={async () => {
        addCart.mutate({
          productID
        })

      }}
    >{children} </Button>
  )
}
