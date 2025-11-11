import { Router } from "express";
import { login } from "../controllers/AuthController";

export const authRouter = Router();

authRouter.post('/login', login);
