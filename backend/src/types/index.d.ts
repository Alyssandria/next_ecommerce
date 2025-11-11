import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface credentials extends JwtPayload {
  email: string,
}
export interface AuthenticatedRequest extends Request {
  user?: credentials
}
