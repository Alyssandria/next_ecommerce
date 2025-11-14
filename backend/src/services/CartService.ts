import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../config/db/db";
import { carts } from "../config/db/schema";
import { cartValidatorPartial, type cartValidator } from "../validators/Cart";
import { fetchProductsById } from "./ProductService";
import { env } from "../config/env";

export const createCart = (data: cartValidator) => {
  return db.insert(carts).values({
    userId: data.user_id,
    productId: data.product_id,
    quantity: data.quantity
  }).onConflictDoUpdate({
    target: [carts.productId, carts.userId],
    set: { quantity: sql`${carts.quantity} + 1` }
  }).returning({
    id: carts.id,
    user_id: carts.userId,
    product_id: carts.productId,
    quantity: carts.quantity
  })
}

export const updateCart = (id: number, data: cartValidatorPartial) => {
  return db.update(carts).set({
    quantity: data.quantity,
    userId: data.user_id,
    productId: data.product_id
  }).where(eq(carts.id, id));
}

export const deleteCart = (ids: number[]) => {
  return db.delete(carts).where(inArray(carts.id, ids)).returning();
}

export const getCarts = async (userId: number) => {
  const items = await db.query.carts.findMany({
    where: ((carts, { eq }) => eq(carts.userId, userId))
  });

  const promises = await fetchProductsById(items.map(el => el.productId))

  const json = await Promise.all(promises.map(async (res) => {
    if (res.status === "fulfilled") {
      return res.value.json();
    }

    return null;
  })) as ({ id: number } | null)[];

  const res = json.map(el => {
    if (!el) return el;
    const quantity = items.find(x => el.id === x.productId)!.quantity;
    return {
      quantity,
      productData: el
    }
  });

  return res;

}
