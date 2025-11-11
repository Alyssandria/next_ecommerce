import { RequestHandler } from "express";
import { authLoginValidatorSchema } from "../validators/Auth";
import { validatorError } from "../services/ErrorService";
import { findUserByEmail } from "../services/UserService";
import bcrypt from "bcrypt";

export const login: RequestHandler = async (req, res, next) => {
  // VALIDATE POST BODY

  const validated = authLoginValidatorSchema.safeParse(req.body);

  if (!validated.success) {
    return validatorError(res, validated.error)
  }

  const { email, password } = validated.data;

  // CHECK IF CREDENTIALS EXIST
  try {
    const user = await findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
    }

    return res.status(401).json({
      success: false,
      error: {
        email: "The credentials provided does not match any in our system"
      }
    });
  } catch (error) {
    console.log(error);
    next();
  }
}
