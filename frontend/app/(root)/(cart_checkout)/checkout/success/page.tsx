"use client"

import { fetchWithAuth } from "@/lib/utils";
import { Order } from "@/types";
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";

export default function SuccessPage() {
  const token = useSearchParams().get("token");
  const [order, setOrder] = useState<Order | null>(null);
  const isAlreadyCapturedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isAlreadyCapturedRef.current) return;

    isAlreadyCapturedRef.current = true

    const fetchData = async () => {
      const response = await fetchWithAuth(
        `/payments/capture/${token}`,
        {
          method: "POST",
        }
      );

      if (!response.ok && response.status !== 401) {
        console.log(response);
        return;
      }

      setOrder((await response.json()).data as Order);

    }

    fetchData();

  }, []);
  console.log(order);

  return (
    <div>
      <h1>Success Page</h1>
    </div>
  )
}
