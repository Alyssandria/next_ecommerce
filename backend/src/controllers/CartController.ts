import { RequestHandler } from "express";
import { cartValidatorSchema } from "../validators/Cart";
import { drizzleError, validatorError } from "../services/ErrorService";
import { createCart } from "../services/CartService";
import { DrizzleQueryError } from "drizzle-orm";

export const postCart: RequestHandler = async (req, res, next) => {
  // VALIDATE POST BODY

  const validated = cartValidatorSchema.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  try {
    const newCart = await createCart(validated.data);

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
