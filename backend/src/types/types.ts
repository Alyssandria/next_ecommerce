import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import z from "zod"
import { users } from "../config/db/schema";

export const getPaginationQuery = z.object({
  limit: z.string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val), {
      error: "Invalid Type, Must be number"
    })
    .optional(),
  skip: z.string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val), {
      error: "Invalid Type, Must be number"
    })
    .optional(),
});
export const routeParam = z.object({
  id: z.string().regex(/^\d+$/, "Invalid Type. Must be a valid user id").transform(val => Number(val))
});

export interface credentials extends JwtPayload {
  email: string,
  id: number
}
export interface UserPayload {
  id: number,
  email: string,
  lastName: string,
  firstName: string
}
export interface AuthenticatedRequest extends Request {
  user?: UserPayload
}
