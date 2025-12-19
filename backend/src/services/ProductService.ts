import { env } from "../config/env"

export const fetchProducts = async (
  limit: number = 30,
  skip: number = 0,
  sortBy: string = "title",
  order: "asc" | "desc" = "asc",
  category?: string,
  search?: string
) => {
  let fetchString = "";

  if (category) {
    fetchString = `${env.BASE_PRODUCTS_API}/category/${category}?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
  } else if (search) {
    fetchString = `${env.BASE_PRODUCTS_API}/search?q=${search}&limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
  } else {
    fetchString = `${env.BASE_PRODUCTS_API}?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
  }

  const items = await fetch(fetchString);

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

export const fetchCategories = async () => {
  const categories = await fetch(`${env.BASE_PRODUCTS_API}/categories`);

  if (!categories.ok) {
    return [];
  }

  const json = (await categories.json()) as {
    slug: string,
    name: string,
    url: string,
  }[];

  return json.map(el => ({
    slug: el.slug,
    name: el.name
  }))
}

export const fetchProductsById = async (ids: number[]) => {
  const reqs: Promise<Response>[] = [];

  for (const id of ids) {
    reqs.push(fetch(`${env.BASE_PRODUCTS_API}/${id}`));
  }

  return Promise.all(reqs);
}
