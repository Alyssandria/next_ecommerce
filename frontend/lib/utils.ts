import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fetchApi(route: string, opts?: RequestInit) {
  if (route.startsWith('/')) route = route.slice(1);
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`, {
    headers: {
      "Content-Type": "application/json",
      ...opts?.headers
    },
    ...opts
  });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
    ;
}

export function calculateOriginalPrice(price: number, discount: number) {
  return (((discount / 100) * price) + price);

}
