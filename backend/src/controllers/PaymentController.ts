import { RequestHandler } from "express";
import { createPaypalOrder } from "../services/PaypalService";
import { AuthenticatedRequest } from "../types/types";
import { orderPaymentSchema } from "../validators/Order";
import { validatorError } from "../services/ErrorService";

export const handleOrderCapture: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
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
      data: await createPaypalOrder(validated.data)
    });
  } catch (error) {
    console.log(error);
    next();
  }
}
