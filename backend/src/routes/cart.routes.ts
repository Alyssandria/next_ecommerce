import { Router } from "express";
import { postCart } from "../controllers/CartController";

export const cartRouter = Router();

cartRouter.post('/', postCart);
