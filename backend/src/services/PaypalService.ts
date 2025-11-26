import { ApiResponse, CheckoutPaymentIntent, Client, Environment, LogLevel, Order, OrderRequest, OrdersController, PaymentsController } from "@paypal/paypal-server-sdk";
import { env } from "../config/env";
import { orderPaymentValidator } from "../validators/Order";

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
const paymentsController = new PaymentsController(client);

export const createOrderPayment = async (data: orderPaymentValidator) => {
  const collect: {
    body: OrderRequest
  } = {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
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
              name: "T-Shirt",
              unitAmount: {
                currencyCode: "PHP",
                value: el.price,
              },
              quantity: String(el.quantity),
              description: "Super Fresh Shirt",
            })),
        },
      ],
    },
  };

  const { body, ...httpResponse } = await ordersController.createOrder(collect);

  return {
    body: JSON.parse(body as string),
    status: httpResponse.statusCode
  } as { body: Order, status: number };
}

export const captureOrderPayment = async (token: string) => {
  const collect = {
    id: token
  }

  const { body, ...httpResponse } = await ordersController.captureOrder(collect);

  return {
    body: JSON.parse(body as string),
    status: httpResponse.statusCode
  }
}

