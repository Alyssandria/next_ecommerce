import { Router } from "express";
import { deleteUserRoute, getUser, patchUser } from "../controllers/UserController";

export const userRouter = Router();

userRouter.get('/:id', getUser);
userRouter.patch('/:id', patchUser);
userRouter.delete('/:id', deleteUserRoute);
