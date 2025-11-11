import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthenticatedRequest } from "../types";


export const auth: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = await jwt.verify(token, env.app.APP_JWT_SECRET) as { email: string };
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}
