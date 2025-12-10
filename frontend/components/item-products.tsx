"use client"

import { CartItem } from "@/types";
import { ComponentProps, createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Minus, Plus, XIcon } from "lucide-react";
import { cn, formatCase, formatPrice } from "@/lib/utils";
import Image from "next/image";

type CartItemContextType = {
  item: CartItem,
  quantity: number,
  setQuantity: Dispatch<SetStateAction<number>>
}
const CartItemContext = createContext<CartItemContextType | null>(null);

const useCartItemContext = () => {
  const context = useContext(CartItemContext);

  if (!context) {
    throw new Error("Context must be used within CartItemContext component");
  }

  return context;
}

export const CartProduct = ({ className, children, item, ...props }: { item: CartItem } & ComponentProps<"div">) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);
  return (
    <CartItemContext value={{
      item: {
        ...item,
        quantity
      },
      quantity,
      setQuantity
    }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </CartItemContext>
  )
}

export const CartProductTitle = ({ className, ...props }: ComponentProps<"span">) => {
  const { item } = useCartItemContext();
  return (
    <span className={cn("block font-bold text-lg max-w-[12ch] truncate", className)} {...props}>{item.productData.title}</span>
  )
}

export const CartProductCategory = ({ className, ...props }: ComponentProps<"span">) => {
  const { item } = useCartItemContext();

  return (
    <span className={cn("text-muted-foreground", className)} {...props}>{formatCase(item.productData.category)}</span>
  )

}

export const CartProductDelete = ({ onDelete, className, ...props }: { onDelete?: (id: number) => void } & ComponentProps<typeof Button>) => {
  const { item } = useCartItemContext();

  return (
    <Button
      variant={"ghost"}
      size={"icon-lg"}
      className="text-muted-foreground"
      onClick={() => {
        onDelete?.(item.productData.id);
      }}
      {...props}
    >
      <XIcon />
    </Button>
  )

}


export const CartProductPrice = ({ className, ...props }: ComponentProps<"span">) => {
  const { item } = useCartItemContext();

  return (
    <span className={cn("font-semibold", className)} {...props} >{formatPrice(item.productData.price)}</span>
  )

}


export const CartProductImage = ({ className, ...props }: ComponentProps<"div">) => {
  const { item } = useCartItemContext();

  return (
    <div
      className={cn("bg-neutral-02 w-20 h-24 p-2", className)}
      {...props}
    >
      <Image
        src={item.productData.thumbnail}
        width={80}
        height={96}
        className="object-cover size-full"
        alt="Cart Product Image"
      />
    </div>
  )

}

export const QuantityHandler = (
  {
    onQuantityUpdate,
    className,
    ...props
  }: {
    onQuantityUpdate?: ((id: number, qty: number) => void)
  } & ComponentProps<"div">
) => {
  const context = useCartItemContext();
  useEffect(() => {
    onQuantityUpdate?.(context.item.productData.id, context.quantity);
  }, [context.quantity])

  return (
    <ButtonGroup className={cn("items-center gap-4", className)} {...props}>
      <Button
        variant="ghost"
        size={"icon-lg"}
        onClick={() => {
          context.setQuantity(prev => Math.max(1, prev - 1))
        }}
      >
        <Minus />
      </Button>
      <span>{context.quantity}</span>
      <Button
        variant="ghost" size={"icon-lg"}
        onClick={() => {
          context.setQuantity(prev => prev + 1)
        }}
      >
        <Plus />
      </Button>
    </ButtonGroup>
  )
}
