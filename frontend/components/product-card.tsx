import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { ComponentProps } from "react";
import Image from "next/image";
import { ProductRating } from "./product-rating";
import { calculateOriginalPrice, formatPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import { AddToCart } from "./add-to-cart";


interface ProductCardProps extends ComponentProps<"div"> {
  data: Product
  onCartAdd?: () => void;
}
export const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Card className="pt-0">
      <CardContent className="bg-[#F3F5F7] relative py-6">
        <div className="bg-green w-fit px-4 py-1 rounded-sm font-bold text-white">
          <span>-{Math.floor(data.discountPercentage)}%</span>
        </div>
        <Image src={data.thumbnail} width={800} height={600} alt="Product Image" />
        <div className="absolute flex items-center justify-center left-0 bottom-6 w-full px-6">
          <AddToCart productID={data.id}>Add to cart</AddToCart>
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
