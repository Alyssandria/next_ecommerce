import { cn } from "@/lib/utils"
import * as React from "react"
export const Star = ({ className, ...props }: React.ComponentPropsWithoutRef<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="none"
    className={cn("size-6 fill-neutral-05", className)}
    {...props}
  >
    <path
      d="M7.538 1.11a.5.5 0 0 1 .924 0l1.537 3.696a.5.5 0 0 0 .421.306l3.99.32a.5.5 0 0 1 .285.878l-3.04 2.604a.5.5 0 0 0-.16.496l.928 3.893a.5.5 0 0 1-.747.542L8.261 11.76a.5.5 0 0 0-.522 0l-3.415 2.086a.5.5 0 0 1-.747-.542l.928-3.893a.5.5 0 0 0-.16-.496L1.304 6.31a.5.5 0 0 1 .285-.878l3.99-.32A.5.5 0 0 0 6 4.806L7.538 1.11Z"
    />
  </svg>
)
