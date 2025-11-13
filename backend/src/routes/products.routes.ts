import { Router } from "express";
import { getProduct, getProducts } from "../controllers/ProductController";

export const productRouter = Router();

productRouter.get('/', getProducts)
productRouter.get('/:id', getProduct)

