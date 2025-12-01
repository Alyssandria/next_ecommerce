import { RequestHandler } from "express";
import { captureOrderPayment, createOrderPayment, getOrderDetails } from "../services/PaypalService";
import { AuthenticatedRequest } from "../types/types";
import { orderPaymentSchema } from "../validators/Order";
import { validatorError } from "../services/ErrorService";
import z from "zod";
import { createOrder } from "../services/OrderService";

export const handleOrderCreate: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  console.log(req.body);
  const validated = orderPaymentSchema.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  try {
    return res.json({
      success: true,
      data: await createOrderPayment(validated.data)
    });
  } catch (error) {
    console.log(error);
    next();
  }
}

const paymentCaptureParams = z.object({
  token: z.string()
});

export const handleOrderCapture: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }


  const validated = paymentCaptureParams.safeParse(req.params);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { token } = validated.data;

  try {
    const captured = await captureOrderPayment(token);

    const { result, status } = await getOrderDetails(captured.result.id!);

    const purchaseUnit = result.purchaseUnits![0];

    console.log(result.purchaseUnits);
    const items = purchaseUnit.items!;

    console.log(items);
    const order = await createOrder(req.user.id, {
      order_no: token,
      products: items.map(el => ({
        name: el.name,
        product_id: Number(el.sku!),
        price: el.unitAmount.value,
        quantity: Number(el.quantity)
      })),
      total: purchaseUnit.amount!.value
    });


    return res.status(status).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.log(error);
    next();
  }
}
