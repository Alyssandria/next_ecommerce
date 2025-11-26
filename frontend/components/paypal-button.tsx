import { fetchWithAuth } from "@/lib/utils";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

interface PaypalButtonProps {
  data: {
    total: number,
    products: {
      product_id: number,
      price: number,
      quantity: number
    }[]
  }
}
export const PaypalButton = ({ data }: PaypalButtonProps) => {
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
          body: {
            id: string,
          }
        };

        return orderData.body.id;
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

          console.log(orderData);
          const errorDetail = orderData?.details?.[0];

          if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
          } else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            throw new Error(
              `${errorDetail.description} (${orderData.debug_id})`
            );
          } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction =
              orderData.purchase_units[0].payments
                .captures[0];
            console.log(
              "Capture result",
              orderData,
              JSON.stringify(orderData, null, 2)
            );
          }
        } catch (error) {
          console.error(error);
        }
      }}
    />

  )
}
