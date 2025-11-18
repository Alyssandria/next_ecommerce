import { RequestHandler } from "express";
import { fetchProduct, fetchProducts } from "../services/ProductService";
import z from "zod";
import { validatorError } from "../services/ErrorService";
import { getPaginationQuery, routeParam } from "../types/types";


export const getProducts: RequestHandler = async (req, res) => {
  const validated = getPaginationQuery.safeParse(req.query);

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
