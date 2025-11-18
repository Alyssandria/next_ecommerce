import { Router } from "express";
import { deleteCartRoute, getCart, getCartCountRoute, patchCart, postCart } from "../controllers/CartController";
import { auth } from "../middleware/auth";

export const cartRouter = Router();

cartRouter.get('/', auth, getCart);
cartRouter.get('/count', auth, getCartCountRoute);
cartRouter.post('/', auth, postCart);
cartRouter.patch('/:id', auth, patchCart);
cartRouter.delete('/', auth, deleteCartRoute);
