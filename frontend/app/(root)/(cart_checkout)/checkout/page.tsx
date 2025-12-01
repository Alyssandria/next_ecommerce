"use client";

import { CartProduct } from "@/components/cart-products";
import { PaypalButton } from "@/components/paypal-button";
import { useProductsByIds } from "@/hooks/use-products-by-id";
import { CartItem } from "@/types";
import { Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// CHECK SEARCH PARAMS
// REDIRECT IF NO SESSION TOKEN FOUND

const OrderProducts = ({ ids }: { ids: number[] }) => {
  const { error, data, isPending } = useProductsByIds(ids);
  console.log(data);

  if (isPending) {
    return (
      <div>
        <Loader2Icon className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        Error
      </div>
    )
  }

  return (
    <div>
      {data.data.map(el => (
        <CartProduct data={el} />
      ))}
    </div>
  )
}
export default function Checkout() {
  const [items, setItems] = useState<CartItem[]>();
  const [total, setTotal] = useState(0);
  const router = useRouter()
  const params = useSearchParams();
  const { data } = useProductsByIds(params.getAll('ids').map(el => Number(el)))

  useEffect(() => {
    if (!params.has('ids')) {
      setTimeout(() => toast.error('Must select products to access checkout'));
      router.replace('/carts');
    }
  }, [router, params]);

  useEffect(() => {
    setItems(data?.data);
  }, [data?.data]);

  useEffect(() => {
    let total = 0;

    items?.forEach(el => total = Number((total + el.quantity * el.productData.price).toFixed(2)));

    setTotal(total);

  }, [items])

  console.log(items);


  return (
    <div>
      <div>
        <span className="text-lg font-medium">Order Summary</span>
        <OrderProducts ids={params.getAll('ids').map(el => Number(el))} />
        {total}
        This is checkout
        <PaypalButton data={{
          total,
          products: items ? items.map(el => ({
            name: el.productData.title,
            product_id: el.productData.id,
            quantity: el.quantity,
            price: Number(el.productData.price.toFixed(2)),
          })) : []
        }} />
      </div>
    </div>
  )
}
