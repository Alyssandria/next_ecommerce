import express, { json } from "express";
import { userRouter } from "./routes/user.routes";
import { cartRouter } from "./routes/cart.routes";
import { authRouter } from "./routes/auth.routes";

export const app = express();

app.use(json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/auth', authRouter);
