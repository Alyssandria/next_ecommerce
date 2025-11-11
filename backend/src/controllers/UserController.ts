import { RequestHandler } from "express";
import z from "zod";
import { createUser, deleteUser, findUser, updateUser } from "../services/UserService";
import { validatorError } from "../services/ErrorService";
import { userValidatorSchema, userValidatorSchemaPartial } from "../validators/User";
import { DrizzleQueryError } from "drizzle-orm";

const userRouteParam = z.object({
  id: z.string().regex(/^\d+$/, "Invalid Type. Must be a valid user id")
})
export const getUser: RequestHandler<z.infer<typeof userRouteParam>> = async (req, res, next) => {
  const validatedParams = userRouteParam.safeParse(req.params);

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
  const validatedParams = userRouteParam.safeParse(req.params);

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
    const updated = await updateUser(Number(id), {
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

export const postUser: RequestHandler = async (req, res, next) => {
  // VALIDATE POST BODY
  const validated = userValidatorSchema.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error)
  }

  const { first_name, last_name, password, email } = validated.data;

  try {
    const newUser = await createUser({
      first_name,
      last_name,
      password,
      email
    })

    return res.status(201).json({
      success: true,
      data: newUser
    });

  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as any;
      const code = cause?.code;

      if (code === "23505") {
        return res.status(400).json({
          success: false,
          errors: {
            "email": "Email already exists"
          }
        });
      }
    }
    next();
  }
}

export const deleteUserRoute: RequestHandler = async (req, res, next) => {
  // VALIDATE PARAMS
  const validatedParams = userRouteParam.safeParse(req.params);

  if (!validatedParams.success) {
    return validatorError(res, validatedParams.error);
  }

  const { id } = validatedParams.data

  try {
    const deleted = await deleteUser(Number(id));

    return res.json({
      success: true,
      data: {
        id: Number(id),
      }
    })

  } catch (error) {
    console.log(error);
    next();
  }
}

