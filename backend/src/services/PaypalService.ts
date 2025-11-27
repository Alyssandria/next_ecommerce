import { ApiResponse, CheckoutPaymentIntent, Client, Environment, LogLevel, OrderRequest, OrdersController, PaymentsController } from "@paypal/paypal-server-sdk";
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

