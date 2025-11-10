import { RequestHandler } from "express";
import z from "zod";
import { findUser } from "../services/UserService";

const getUserRouteParams = z.object({
  id: z.string().regex(/^\d+$/, "Invalid Type. Must be a valid user id")
})
export const getUser: RequestHandler<z.infer<typeof getUserRouteParams>> = async (req, res, next) => {
  const validatedParams = getUserRouteParams.safeParse(req.params);

  if (!validatedParams.success) {
    return res.status(400).json({
      success: false,
      errors: z.treeifyError(validatedParams.error).properties,
    });
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

export const createUser = () => {

}

