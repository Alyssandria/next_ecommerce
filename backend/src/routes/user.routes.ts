import { Router } from "express";
import { deleteUserRoute, getUser, patchUser, postUser } from "../controllers/UserController";

export const userRouter = Router();

userRouter.get('/:id', getUser);
userRouter.post('/', postUser)
userRouter.patch('/:id', patchUser)
userRouter.delete('/:id', deleteUserRoute)
