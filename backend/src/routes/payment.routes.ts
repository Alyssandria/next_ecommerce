import { Router } from "express";
import { auth } from "../middleware/auth";
import { handleOrderCapture, handleOrderCreate } from "../controllers/PaymentController";

export const paymentRouter = Router();

paymentRouter.post('/', auth, handleOrderCreate);
paymentRouter.post('/capture/:token', auth, handleOrderCapture);
