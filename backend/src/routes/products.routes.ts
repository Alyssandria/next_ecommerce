import { Router } from "express";
import { getProductByIds, getProducts } from "../controllers/ProductController";
import { auth } from "../middleware/auth";

export const productRouter = Router();

productRouter.get('/', getProducts)
productRouter.get('/checkout', auth, getProductByIds)

