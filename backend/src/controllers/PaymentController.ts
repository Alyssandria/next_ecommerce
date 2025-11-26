import { RequestHandler } from "express";
import { captureOrderPayment, createOrderPayment } from "../services/PaypalService";
import { AuthenticatedRequest } from "../types/types";
import { orderPaymentSchema } from "../validators/Order";
import { validatorError } from "../services/ErrorService";
import z from "zod";

export const handleOrderCreate: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

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
})
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
    const { status, body } = await captureOrderPayment(token);

    return res.status(status).json({
      success: true,
      data: body
    });
  } catch (error) {
    console.log(error);
    next();
  }
}
