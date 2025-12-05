import { CheckoutPaymentIntent, Client, Environment, LogLevel, OrderRequest, OrdersController, PaymentsController } from "@paypal/paypal-server-sdk";
import { env } from "../config/env";
import { PaymentOrderValidator } from "../validators/PaymentOrder";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: env.PAYPAL_SECRET
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

export const createOrderPayment = async (data: PaymentOrderValidator) => {
  const collect: {
    body: OrderRequest
  } = {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          shipping: {
            name: {
              fullName: data.shippingDetails.recipient
            },
            address: {
              addressLine1: data.shippingDetails.street,
              addressLine2: data.shippingDetails.province,
              adminArea1: String(data.shipping_id),
              adminArea2: data.shippingDetails.province,
              postalCode: data.shippingDetails.zip,
              countryCode: "PH"
            }

          },
          amount: {
            currencyCode: "PHP",
            value: data.total,
            breakdown: {
              itemTotal: {
                currencyCode: "PHP",
                value: data.total,
              },
            },
          },
          items:
            data.products.map(el => ({
              name: el.name,
              sku: String(el.product_id),
              unitAmount: {
                currencyCode: "PHP",
                value: el.price,
              },
              quantity: String(el.quantity),
            })),
        },
      ],
    },
  };

  const { result, ...httpResponse } = await ordersController.createOrder(collect);

  return {
    result,
    status: httpResponse.statusCode
  };
}

export const captureOrderPayment = async (token: string) => {
  const collect = {
    id: token
  }

  const { result, ...httpResponse } = await ordersController.captureOrder(collect);

  return {
    result,
    status: httpResponse.statusCode
  }
}

export const getOrderDetails = async (id: string) => {
  const { result, ...httpResponse } = await ordersController.getOrder({ id });

  return {
    result,
    status: httpResponse.statusCode
  }
}

