"use client";

import { CartProduct } from "@/components/cart-products";
import { PaypalButton } from "@/components/paypal-button";
import { useProductsByIds } from "@/hooks/use-products-by-id";
import { useShippings } from "@/hooks/use-shiippings";
import { paymentFormValidator } from "@/lib/validations/checkoutValidators";
import { CartItem } from "@/types";
import { Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const shippings = useShippings();
  const [currShipping, setCurrShipping] = useState<number | null>(
    shippings.data?.id
    || null
  );


  console.log(shippings.data);
  const [items, setItems] = useState<CartItem[]>();
  const [total, setTotal] = useState(0);
  const router = useRouter()
  const params = useSearchParams();
  const { data } = useProductsByIds(params.getAll('ids').map(el => Number(el)))

  const form = useForm<paymentFormValidator>({
    defaultValues: {
      type: currShipping !== null ? "existing" : "new",
      total: String(total)
    }
  });

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

  return (
    <div>
      <form>

      </form>
      <div>
        <span className="text-lg font-medium">Order Summary</span>
        <OrderProducts ids={params.getAll('ids').map(el => Number(el))} />
        <PaypalButton
          onApprove={() => {
            console.log("Hello?");
            setTimeout(() => toast.success('Order Successful'));

            setTimeout(() => {
              router.push('/success');
            }, 2000)
          }}
          data={{
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
