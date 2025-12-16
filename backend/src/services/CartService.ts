import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../config/db/db";
import { carts, users } from "../config/db/schema";
import { cartValidatorPartial, updateCartValidator, type cartValidator } from "../validators/Cart";
import { fetchProductsById } from "./ProductService";
import { env } from "../config/env";
import { json } from "express";

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

export const updateCart = (id: number, userId: number, data: updateCartValidator) => {
  return db.update(carts).set({
    quantity: data.quantity,
  }).where(
    and(
      eq(carts.id, id),
      eq(carts.userId, userId)
    )).returning();
}

export const deleteCart = (userId: number, ids: number[]) => {
  return db.delete(carts).where(
    and(
      inArray(carts.id, ids),
      eq(carts.userId, userId)
    )
  ).returning();
}

export const getCarts = async (userId: number, limit: number = 15, skip: number = 0) => {
  const items = await db.select().from(carts).orderBy(desc(carts.createdAt)).where(eq(carts.userId, userId)).limit(limit).offset(skip)
  const promises = await fetchProductsById(items.map(el => el.productId))

  const json = await Promise.all(promises.map(async (res) => {
    return await res.json();
  }))

  const res = json.map(el => {
    const cartItem = items.find(x => el.id === x.productId);
    if (!cartItem) return null;
    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      productData: el
    }
  });
  return res;
}

export const getCartItemsById = async (userId: number, ids: number[]) => {
  const items = await db.select().from(carts).where(
    and(
      eq(carts.userId, userId),
      inArray(carts.productId, ids)
    )
  )

  const promises = await fetchProductsById(items.map(el => el.productId));

  const json = await Promise.all(promises.map(el => el.json()));

  return json.map(el => {
    const cartItem = items.find(x => el.id === x.productId);
    if (!cartItem) return null;
    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      productData: el
    }
  });
}

export const getCartCount = (userId: number) => {
  return db.$count(carts, eq(carts.userId, userId));
}
