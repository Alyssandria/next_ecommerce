import { RequestHandler } from "express";
import { AuthenticatedRequest, routeParamId } from "../types/types";
import { orderValidatorSchema } from "../validators/Order";
import { validatorError } from "../services/ErrorService";
import { createOrder, getUserOrder, getUserOrders } from "../services/OrderService";
import { DrizzleQueryError } from "drizzle-orm";

export const getOrders: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  try {
    const orders = await getUserOrders(req.user.id);

    return res.json({
      success: true,
      data: orders
    })
  } catch (error) {
    console.log(error);
    next();
  }
}
export const getOrder: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const param = routeParamId.safeParse(req.params);

  if (!param.success) {
    return validatorError(res, param.error);
  }

  const { id } = param.data;

  try {

    const order = await getUserOrder(req.user.id, id);

    return res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.log(error);
    next();
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
