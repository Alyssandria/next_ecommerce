import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const MobileMenuIcon = ({ className, ...props }: ComponentProps<"svg">) => (
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
      strokeWidth={1.5}
      d="M7 8h10M7 12h10M7 16h10"
    />
  </svg>
)
