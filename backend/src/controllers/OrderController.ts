import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../types/types";
import { orderValidatorSchema } from "../validators/Order";
import { validatorError } from "../services/ErrorService";
import { createOrder } from "../services/OrderService";
import { success } from "zod";
import { DrizzleQueryError } from "drizzle-orm";

export const getOrders: RequestHandler = (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
}

export const postOrders: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }


  const validated = orderValidatorSchema.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { order_no, products, total } = validated.data

  try {

    const order = await createOrder(req.user.id, {
      order_no,
      products,
      total,
    })

    return res.json({
      success: true,
      data: order
    })
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as any;
      const code = cause?.code;

      if (code === "23505") {
        return res.status(400).json({
          success: false,
          errors: {
            global: false,
            form: {
              fieldErrors: {
                "order_no": [
                  "Order Number already exists"
                ]
              }
            }
          }
        });
      }
    }

    next();
  }
}
