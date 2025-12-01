import { RequestHandler } from "express";
import { AuthenticatedRequest, routeParamId } from "../types/types";
import { ShippingValidatorSchema, ShippingValidatorSchemaPartial } from "../validators/Shipping";
import { validatorError } from "../services/ErrorService";
import { createShipping, getUserShipping, updateShipping } from "../services/ShippingService";

export const getShipping: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) { return res.sendStatus(401) }
  try {
    const shippings = await getUserShipping(req.user.id);

    return res.json({
      success: true,
      data: shippings
    });
  } catch (error) {
    console.log(error);
    next();
  }
}
export const postShipping: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const validated = ShippingValidatorSchema.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { label, recipient, street, province, zip } = validated.data;

  try {
    const shipping = await createShipping(req.user.id, {
      label,
      recipient,
      street,
      province,
      zip
    })

    console.log(shipping);

    return res.status(201).json({
      success: true,
      data: shipping
    });

  } catch (error) {
    console.log(error);
    next();
  }
}

export const patchShipping: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) { return res.sendStatus(401) }

  const validated = ShippingValidatorSchemaPartial.safeParse(req.body);
  const param = routeParamId.safeParse(req.params);

  if (!param.success) {
    return validatorError(res, param.error);
  }

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { id } = param.data;
  const { label, recipient, zip, province, street } = validated.data

  try {
    const updated = await updateShipping(req.user.id, id, {
      label,
      recipient,
      zip,
      street,
      province
    })

    return res.json({
      success: true,
      data: updated
    })

  } catch (error) {
    console.log(error);
    next();
  }
}
