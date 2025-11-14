import { RequestHandler } from "express";
import { authLoginValidatorSchema } from "../validators/Auth";
import { validatorError } from "../services/ErrorService";
import { createUser, findUserByEmail } from "../services/UserService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { env } from "../config/env";
import { userValidatorSchema } from "../validators/User";
import { DrizzleQueryError } from "drizzle-orm";
import { db } from "../config/db/db";
import { AuthenticatedRequest, credentials } from "../types/types";

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        errors: {
          global: false,
          form: {
            fieldErrors: {
              email: [
                "The credentials provided does not match any in our system"
              ]
            }

          }
        }
      });
    }

    const token = jwt.sign({ id: user.id, email }, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: '/'
    });

    res.json({
      success: true,
      data: {
        token
      }
    });

  } catch (error) {
    console.log(error);
    next();
  }
}

export const refresh: RequestHandler = async (req: AuthenticatedRequest, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: {
        "_global": "Invalid or unauthorized token",
      }
    });
  }

  try {
    const verify = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as credentials;

    const token = jwt.sign({ id: verify.id, email: verify.email }, env.JWT_SECRET);

    return res.json({ token });

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        "_global": "Invalid or unauthorized token",
      }
    });
  }

}


export const register: RequestHandler = async (req, res, next) => {
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
            global: false,
            form: {
              fieldErrors: {
                "email": [
                  "Email already exists"
                ]
              }
            }
          }
        });
      }
    }

    console.log(error);
    next();
  }
}
