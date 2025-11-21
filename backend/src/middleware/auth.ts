import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthenticatedRequest, credentials } from "../types/types";
import { findUser } from "../services/UserService";


export const auth: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const verify = jwt.verify(token, env.JWT_SECRET) as credentials;
    const user = await findUser(verify.id);
    console.log(verify);

    if (!user) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}
