import { RequestHandler } from "express";
import { captureOrderPayment, createOrderPayment, getOrderDetails } from "../services/PaypalService";
import { AuthenticatedRequest, orderTokenParams } from "../types/types";
import { validatorError } from "../services/ErrorService";
import { createOrder, getUserOrder } from "../services/OrderService";
import { paymentFormValidatorSchema } from "../validators/Order";
import { createShipping, getUserShipping } from "../services/ShippingService";
import { ApiError } from "@paypal/paypal-server-sdk";
import { success } from "zod";

export const handleOrderCreate: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const validated = paymentFormValidatorSchema.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { type, total, products } = validated.data;


  try {
    let shipping = null;

    if (type === "new") {
      // CREATE NEW
      shipping = await createShipping(req.user.id, validated.data.shippingDetails);
    } else {
      // GET EXISTING
      shipping = await getUserShipping(req.user.id, validated.data.shipping_id);
    }

    console.log(shipping);

    if (shipping.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          global: false,
          errors: {
            fieldErrors: {
              shipping_id: [
                "Shipping id provided cannot be found"
              ],
            }
          }
        }
      })
    }

    return res.json({
      success: true,
      data: await createOrderPayment({
        shipping_id: shipping[0].id,
        shippingDetails: shipping[0],
        total,
        products
      })
    });

  } catch (error) {
    console.log(error);
    next();
  }
}


export const handleOrderCapture: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }


  const validated = orderTokenParams.safeParse(req.params);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { token } = validated.data;

  try {

    const existing = await getUserOrder(req.user.id, token);

    if (existing) {
      return res.json({
        success: true,
        data: existing
      });
    }

    const captured = await captureOrderPayment(token);
    const { result, status } = await getOrderDetails(captured.result.id!);


    const purchaseUnit = result.purchaseUnits![0];

    const items = purchaseUnit.items!;

    const order = await createOrder(req.user.id, {
      order_no: token,
      shipping_id: Number(purchaseUnit.customId),
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
    if (error instanceof ApiError) {
      if (error.result.details[0].issue === "ORDER_ALREADY_CAPTURED") {
        const order = await getUserOrder(req.user.id, token);
        return res.json({
          success: true,
          data: order
        });

      }
    }
    next();
  }
}
