import { Router } from "express";
import { deleteUserRoute, getUser, patchUser } from "../controllers/UserController";
import { auth } from "../middleware/auth";

export const userRouter = Router();

userRouter.get('/:id', auth, getUser);
userRouter.patch('/:id', auth, patchUser);
userRouter.delete('/:id', auth, deleteUserRoute);
