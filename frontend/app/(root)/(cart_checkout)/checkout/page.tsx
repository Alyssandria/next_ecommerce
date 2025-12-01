"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

// CHECK SEARCH PARAMS
// REDIRECT IF NO SESSION TOKEN FOUND
export default function Checkout() {
  const router = useRouter()
  const params = useSearchParams();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    if (!params.has('ids')) {
      setTimeout(() => toast.error('Must select products to access checkout'));
      router.replace('/carts');
    }

    if (!getItem('token')) {
      setTimeout(() => toast.error('Unauthorized, login to access'));
      router.replace('/login');
    }
  }, [router, params]);

  return (
    <div>
      This is checkout
    </div>
  )
}
