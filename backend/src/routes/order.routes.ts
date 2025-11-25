import { Router } from "express";
import { auth } from "../middleware/auth";
import { getOrders, postOrders } from "../controllers/OrderController";

export const orderRouter = Router();

orderRouter.get('/', auth, getOrders);
orderRouter.post('/', auth, postOrders);

