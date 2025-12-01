import express, { json } from "express";
import { userRouter } from "./routes/user.routes";
import { cartRouter } from "./routes/cart.routes";
import { authRouter } from "./routes/auth.routes";
import cookieParser from "cookie-parser"
import cors from "cors";
import { env } from "./config/env";
import { productRouter } from "./routes/products.routes";
import { orderRouter } from "./routes/order.routes";
import { paymentRouter } from "./routes/payment.routes";
import { shippingRouter } from "./routes/shipping.routes";

export const app = express();

app.use(cors({
  origin: env.APP_URL,
  credentials: true
}));
app.use(json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/shippings', shippingRouter);
