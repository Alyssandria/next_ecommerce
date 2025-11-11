import { Router } from "express";
import { deleteCartRoute, patchCart, postCart } from "../controllers/CartController";

export const cartRouter = Router();

cartRouter.post('/', postCart);
cartRouter.patch('/:id', patchCart);
cartRouter.delete('/', deleteCartRoute);
