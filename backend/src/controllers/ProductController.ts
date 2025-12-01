import { RequestHandler } from "express";
import { fetchProducts, fetchProductsById } from "../services/ProductService";
import { validatorError } from "../services/ErrorService";
import { AuthenticatedRequest, getPaginationQuery } from "../types/types";
import z from "zod";
import { getCartItemsById } from "../services/CartService";


export const getProducts: RequestHandler = async (req, res) => {
  const validated = getPaginationQuery.safeParse(req.query);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { limit, skip, ids } = validated.data;


  if (ids) {
    const productsPromise = await fetchProductsById(ids);
    return res.json({
      success: true,
      data: await Promise.all(productsPromise.map(async el => await el.json()))
    })
  }

  return res.json({
    success: true,
    data: ids ?
      await fetchProductsById(ids)
      : await fetchProducts(limit, skip)
  });
}

export const routeParam = z.object({
  ids: z.preprocess((val) => {
    if (!Array.isArray(val)) {
      return [val];
    }
    return val;
  }, z.array(z.coerce.number())),
});
export const getProductByIds: RequestHandler = async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const validated = routeParam.safeParse(req.query);

  if (!validated.success) {
    return validatorError(res, validated.error);
  }

  const { ids } = validated.data;

  return res.json({
    success: true,
    data: await getCartItemsById(req.user.id, ids)
  })
}
