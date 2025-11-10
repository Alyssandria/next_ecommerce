import { Router } from "express";
import { getUser } from "../controllers/UserController";

export const router = Router();

router.get('/users/:id', getUser);
router.post('/users')


