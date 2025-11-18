import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const ShoppingBag = ({ className, ...props }: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("size-6", className)}
    fill="none"
    {...props}
  >
    <path
      stroke="#141718"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 6v1a3 3 0 1 0 6 0V6"
    />
    <path
      stroke="#141718"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.611 3H8.389a4 4 0 0 0-3.945 3.342l-1.667 10A4 4 0 0 0 6.722 21h10.556a4 4 0 0 0 3.946-4.658l-1.667-10A4 4 0 0 0 15.612 3Z"
    />
  </svg>
)
