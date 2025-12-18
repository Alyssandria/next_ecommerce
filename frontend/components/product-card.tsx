import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { ComponentProps } from "react";
import Image from "next/image";
import { ProductRating } from "./product-rating";
import { calculateOriginalPrice, cn, formatPrice } from "@/lib/utils";
import { AddToCart } from "./add-to-cart";


interface ProductCardProps extends ComponentProps<"div"> {
  data: Product
  onCartAdd?: () => void;
}
export const ProductCard = ({ className, onCartAdd, data }: ProductCardProps) => {
  return (
    <Card className={cn("pt-0 w-full max-w-[262px]", className)}>
      <CardContent className="w-full bg-[#F3F5F7] relative py-6">
        <div className="bg-green w-fit px-4 py-1 rounded-sm font-bold text-white">
          <span>-{Math.floor(data.discountPercentage)}%</span>
        </div>
        <div className="w-full flex justify-center items-center">
          <Image src={data.thumbnail} width={800} height={600} alt="Product Image" className="w-full object-cover" />
        </div>
        <div className="absolute flex items-center justify-center left-0 bottom-6 w-full px-6">
          <AddToCart onCartAdd={onCartAdd} productID={data.id}>Add to cart</AddToCart>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <ProductRating rating={Math.floor(data.rating)} />
        <p className="max-w-5/6 truncate font-medium text-lg">{data.title}</p>
        <div className="flex gap-3">
          <span className="block font-bold">{formatPrice(data.price)}</span>
          <span className="block line-through text-neutral-04">{formatPrice(calculateOriginalPrice(data.price, data.discountPercentage))}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
