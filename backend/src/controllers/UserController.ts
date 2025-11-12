import { RequestHandler } from "express";
import z from "zod";
import { deleteUser, findUser, updateUser } from "../services/UserService";
import { validatorError } from "../services/ErrorService";
import { userValidatorSchemaPartial } from "../validators/User";

export const routeParam = z.object({
  id: z.string().regex(/^\d+$/, "Invalid Type. Must be a valid user id")
})
export const getUser: RequestHandler<z.infer<typeof routeParam>> = async (req, res, next) => {
  const validatedParams = routeParam.safeParse(req.params);

  if (!validatedParams.success) {
    return validatorError(res, validatedParams.error);
  }

  const { id } = validatedParams.data

  try {
    const user = await findUser(Number(id));
    if (!user) {
      return res.status(404).json({
        success: false,
        errors: {
          id: "Cannot find user that matches the credentials"
        },
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next();
  }
}

export const patchUser: RequestHandler = async (req, res, next) => {
  // VALIDATION
  const validatedParams = routeParam.safeParse(req.params);

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

export const deleteUserRoute: RequestHandler = async (req, res, next) => {
  // VALIDATE PARAMS
  const validatedParams = routeParam.safeParse(req.params);

  if (!validatedParams.success) {
    return validatorError(res, validatedParams.error);
  }

  const { id } = validatedParams.data

  try {
    await deleteUser(Number(id));

    return res.json({
      success: true,
      data: {
        id: Number(id),
      }
    });
  } catch (error) {
    console.log(error);
    next();
  }
}

