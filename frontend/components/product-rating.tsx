import { ComponentPropsWithoutRef } from "react"
import { Star } from "./ui/star"

export const ProductRating = ({ rating }: { rating: number } & ComponentPropsWithoutRef<"div">) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).fill(0).map((_, i) => (
        <Star className={i < rating ? "fill-orange" : ""} key={i} />
      ))}
    </div>

  )

}
