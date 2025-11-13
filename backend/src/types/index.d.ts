import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { $ZodFlattenedError } from "zod/v4/core";

export interface credentials extends JwtPayload {
  email: string,
}
export interface AuthenticatedRequest extends Request {
  user?: credentials
}

