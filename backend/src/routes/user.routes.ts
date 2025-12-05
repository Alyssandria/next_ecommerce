import { Router } from "express";
import { getUser, patchUser } from "../controllers/UserController";
import { auth } from "../middleware/auth";

export const userRouter = Router();

userRouter.get('/', auth, getUser);
userRouter.patch('/:id', auth, patchUser);
