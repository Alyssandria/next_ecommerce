"use client";
import { ComponentProps } from "react";
import { Button } from "./ui/button"
import { fetchApi, fetchWithAuth, refreshToken } from "@/lib/utils";

interface AddToCartProps extends ComponentProps<typeof Button> {
  productID: number,
  onCartAdd?: () => void;
}
export const AddToCart = ({ productID, children, onCartAdd }: AddToCartProps) => {
  return (
    <Button
      type="button"
      className="w-full p-6"
      onClick={async () => {
        const res = await fetchWithAuth('/carts', {
          method: "POST",
          body: JSON.stringify({
            quantity: 1,
            product_id: productID
          })
        });

      }}
    >{children} </Button>
  )
}
