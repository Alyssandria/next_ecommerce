import express, { json } from "express";
import { router } from "./routes/user.routes";

export const app = express();

app.use(json());
app.use('/api/v1', router);
