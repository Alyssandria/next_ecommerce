import { env } from "../config/env"

export const fetchProducts = async (limit: number = 30, skip: number = 0) => {

  const items = await fetch(`${env.BASE_PRODUCTS_API}?limit=${limit}&skip=${skip}`);

  if (!items.ok) {
    return null;
  }

  return await items.json();
}

export const fetchProduct = async (id: number) => {

  const item = await fetch(`${env.BASE_PRODUCTS_API}/${id}`);

  if (!item.ok) {
    return null;
  }

  return await item.json();
}

export const fetchProductsById = async (ids: number[]) => {
  const reqs: Promise<Response>[] = [];

  for (const id of ids) {
    reqs.push(fetch(`${env.BASE_PRODUCTS_API}/${id}`));
  }

  return Promise.allSettled(reqs);
}
