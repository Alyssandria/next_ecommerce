import { Router } from "express";
import { getProductCategories, getProductByIds, getProducts } from "../controllers/ProductController";
import { auth } from "../middleware/auth";

export const productRouter = Router();

productRouter.get('/', getProducts)
productRouter.get('/categories', getProductCategories);
productRouter.get('/checkout', auth, getProductByIds)

