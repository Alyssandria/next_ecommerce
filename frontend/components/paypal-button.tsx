import { fetchWithAuth } from "@/lib/utils";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

interface PaypalButtonProps {
  data: {
    type: "existing" | "new",
    total: number,
    shipping_id?: number,
    shippingDetails?: {
      label: string,
      recipient: string,
      street: string,
      province: string,
      zip: string,
    },
    products: {
      product_id: number,
      price: number,
      quantity: number
    }[]
  },
  onApprove?: () => void
}
export const PaypalButton = ({ onApprove, data }: PaypalButtonProps) => {
  return (
    <PayPalButtons
      style={{
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal",
      }}
      createOrder={async () => {
        const response = await fetchWithAuth("/payments", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          setTimeout(() => toast.error("Something went wrong, please try again later"));
        }

        const orderData = (await response.json()).data as {
          result: {
            id: string,
          }
        };

        return orderData.result.id;
      }}
      onApprove={async (data, actions) => {
        try {
          const response = await fetchWithAuth(
            `/payments/capture/${data.orderID}`,
            {
              method: "POST",
            }
          );

          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message

          // console.log(orderData);
          // const errorDetail = orderData?.details?.[0];
          //
          // if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          //   return actions.restart();
          // } else if (errorDetail) {
          //   // (2) Other non-recoverable errors -> Show a failure message
          //   throw new Error(
          //     `${errorDetail.description} (${orderData.debug_id})`
          //   );
          // }

          onApprove?.();
        } catch (error) {
          console.error(error);
        }


      }}
    />

  )
}
