import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import z from "zod"


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



export const ProductPaginatedQueryParams = z.object({
  ...getPaginationQuery.shape,
  category: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc').optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
})

export const CartPaginatedQuerySchema = z.object({
  ...getPaginationQuery.shape,
  ids: z.preprocess((val) => {
    if (!Array.isArray(val)) {
      return [val];
    }
    return val;
  }, z.array(z.coerce.number())).optional(),
})

export const routeParamId = z.object({
  id: z.string().regex(/^\d+$/, "Invalid Type. Must be a valid user id").transform(val => Number(val))
});

export const orderTokenParams = z.object({
  token: z.string().min(17).max(17)
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
