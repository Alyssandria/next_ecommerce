import { RequestHandler } from "express";
import { deleteUser, updateUser } from "../services/UserService";
import { validatorError } from "../services/ErrorService";
import { userValidatorSchemaPartial } from "../validators/User";
import { AuthenticatedRequest, routeParamId } from "../types/types";
import { getCartCount } from "../services/CartService";

export const getUser: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  try {
    const cartCount = await getCartCount(req.user.id);
    return res.json({
      success: true,
      data: {
        user: req.user,
        cartCount
      }
    });

  } catch (error) {
    next();
  }
}

export const patchUser: RequestHandler = async (req, res, next) => {
  // VALIDATION
  const validatedParams = routeParamId.safeParse(req.params);

  if (!validatedParams.success) {
    return validatorError(res, validatedParams.error);
  }

  const { id } = req.params;

  const validated = userValidatorSchemaPartial.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error)
  }

  const { first_name, last_name, password, email } = validated.data;

  try {
    await updateUser(Number(id), {
      first_name,
      last_name,
      password,
      email
    });

    return res.json({
      success: true,
      data: {
        id: Number(id)
      }
    })


  } catch (error) {
    next();
  }
}

