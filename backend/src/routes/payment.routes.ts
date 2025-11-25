import { Router } from "express";
import { auth } from "../middleware/auth";
import { handleOrderCapture } from "../controllers/PaymentController";

export const paymentRouter = Router();

paymentRouter.post('/', auth, handleOrderCapture);
