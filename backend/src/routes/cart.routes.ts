import { Router } from "express";
import { deleteCartRoute, getCart, patchCart, postCart } from "../controllers/CartController";
import { auth } from "../middleware/auth";

export const cartRouter = Router();

cartRouter.get('/', auth, getCart);
cartRouter.post('/', auth, postCart);
cartRouter.patch('/:id', auth, patchCart);
cartRouter.delete('/', auth, deleteCartRoute);
