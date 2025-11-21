import { RequestHandler } from "express";
import { cartValidatorSchema, cartValidatorSchemaPartial, updateCartValidatorSchema } from "../validators/Cart";
import { validatorError } from "../services/ErrorService";
import { createCart, deleteCart, getCartCount, getCarts, updateCart } from "../services/CartService";
import { DrizzleQueryError } from "drizzle-orm";
import z, { success } from "zod";
import { AuthenticatedRequest, getPaginationQuery, routeParam } from "../types/types";


export const getCartCountRoute: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(403);
  }

  try {
    return res.json({
      success: true,
      data: {
        cartCount: await getCartCount(req.user.id)
      }
    })

  } catch (error) {
    console.error(error);
    next();
  }
}

export const getCart: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(403);
  }

  const validated = getPaginationQuery.safeParse(req.query);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { limit, skip } = validated.data;

  try {
    const cartItems = await getCarts(req.user.id, limit, skip);
    const total = await getCartCount(req.user.id);

    return res.json({
      success: true,
      data: {
        carts: cartItems,
        total,
        skip: skip ?? 0,
        limit: limit ?? 10,
      }
    })
  } catch (error) {
    console.log(error);
    next();
  }
}

export const postCart: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  console.log(req.body);
  if (!req.user) {
    return res.sendStatus(403);
  }

  // VALIDATE POST BODY
  const validated = cartValidatorSchema.omit({ user_id: true }).safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }
  try {
    const newCart = await createCart({
      ...validated.data,
      user_id: req.user.id
    });

    return res.status(201).json({
      success: true,
      data: newCart
    });

  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as any;
      const code = cause?.code;

      if (code === "23503") {
        return res.status(400).json({
          success: false,
          errors: {
            "user_id": "User id is not valid or not found"
          }
        });
      }
    }
    console.log(error);
    next();
  }
}

export const patchCart: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  // VALIDATE PATCHBODY
  if (!req.user) {
    return res.sendStatus(401);
  }

  const validatedBody = updateCartValidatorSchema.safeParse(req.body);

  const validatedParams = routeParam.safeParse(req.params);

  if (!validatedParams.success) {
    return validatorError(res, validatedParams.error);
  }

  const { id } = req.params;

  if (!validatedBody.success) {
    return validatorError(res, validatedBody.error);
  }

  const { quantity } = validatedBody.data;

  try {
    const updated = await updateCart(Number(id), req.user.id, {
      quantity,
    });
    console.log(updated);

    if (updated.length < 1) {
      return res.status(400).json({
        success: false,
        error: {
          global: false,
          form: {
            fieldErrors: {
              id: [
                "Invalid Request. User have no cart item with the corresponding id"
              ]
            }
          }
        }

      })
    }

    return res.json({
      success: true,
      data: {
        id,
      }
    })

  } catch (error) {
    console.log(error);
    next();
  }
}

const deleteParams = z.object({
  ids: z.preprocess((val) => {
    if (!Array.isArray(val)) {
      return [val];
    }
    return val;
  }, z.array(z.coerce.number())),
});

export const deleteCartRoute: RequestHandler = async (req, res, next) => {
  // VALIDATE PARAMS
  const validate = deleteParams.safeParse(req.query);

  if (!validate.success) {
    return validatorError(res, validate.error);
  }
  const { ids } = validate.data

  try {
    const deleted = await deleteCart(ids);

    if (deleted.length === 0) {
      return res.json({
        success: false,
        error: {
          ids: "Invalid or ids cannot be found",
        }
      })
    }

    if (!deleted.length)
      return res.json({
        success: true,
        data: ids
      });

  } catch (error) {
    console.log(error);
    next();
  }
}
