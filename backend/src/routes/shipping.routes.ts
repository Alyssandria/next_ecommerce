import { Router } from "express";
import { auth } from "../middleware/auth";
import { deleteShipping, getShipping, patchShipping, postShipping } from "../controllers/ShippingController";

export const shippingRouter = Router();

shippingRouter.post('/', auth, postShipping);
shippingRouter.get('/', auth, getShipping);
shippingRouter.patch('/:id', auth, patchShipping);
shippingRouter.delete('/:id', auth, deleteShipping);
