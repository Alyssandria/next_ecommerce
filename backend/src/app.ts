import express, { json } from "express";
import { userRouter } from "./routes/user.routes";
import { cartRouter } from "./routes/cart.routes";
import { authRouter } from "./routes/auth.routes";
import cookieParser from "cookie-parser"
import cors from "cors";
import { env } from "./config/env";
export const app = express();

app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});
app.use(cors({
  origin: env.APP_URL,
  credentials: true
}));
app.use(json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/auth', authRouter);
