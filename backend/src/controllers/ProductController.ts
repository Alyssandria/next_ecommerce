import { RequestHandler } from "express";
import { fetchProduct, fetchProducts } from "../services/ProductService";
import z from "zod";
import { validatorError } from "../services/ErrorService";
import { routeParam } from "../types/types";

const getProductsRouteQuery = z.object({
  limit: z.string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val), {
      error: "Invalid Type, Must be number"
    })
    .optional(),
  skip: z.string()
    .transform(val => Number(val))
    .refine(val => !isNaN(val), {
      error: "Invalid Type, Must be number"
    })
    .optional(),
});

export const getProducts: RequestHandler = async (req, res) => {
  const validated = getProductsRouteQuery.safeParse(req.query);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { limit, skip } = validated.data;

  return res.json({
    success: true,
    data: await fetchProducts(limit, skip)
  });
}

export const getProduct: RequestHandler = async (req, res) => {
  const validated = routeParam.safeParse(req.params);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { id } = validated.data;

  return res.json({
    success: true,
    data: await fetchProduct(id)
  })
}
