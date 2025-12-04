import { Router } from "express";
import { auth } from "../middleware/auth";
import { getOrder, getOrders, postOrders } from "../controllers/OrderController";

export const orderRouter = Router();

orderRouter.get('/', auth, getOrders);
orderRouter.get('/:id', auth, getOrder);
orderRouter.post('/', auth, postOrders);

