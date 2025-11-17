import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/AuthController";

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register)
authRouter.post('/refresh', refresh)
authRouter.post('/logout', logout)
