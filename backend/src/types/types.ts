import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import z from "zod"
import { users } from "../config/db/schema";

export const routeParam = z.object({
  id: z.string().regex(/^\d+$/, "Invalid Type. Must be a valid user id").transform(val => Number(val))
});

export interface credentials extends JwtPayload {
  email: string,
  id: number
}
export interface AuthenticatedRequest extends Request {
  user?: typeof users.$inferSelect
}
