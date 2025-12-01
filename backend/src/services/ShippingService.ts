import { and, eq } from "drizzle-orm";
import { db } from "../config/db/db";
import { shippings } from "../config/db/schema";
import { ShippingValidator, ShippingValidatorPartial } from "../validators/Shipping";

export const createShipping = (userId: number, data: ShippingValidator) => {
  return db.insert(shippings).values({
    userId,
    label: data.label,
    recipient: data.recipient,
    street: data.street,
    province: data.province,
    zip: data.zip
  }).returning({
    label: shippings.label,
    street: shippings.street,
    province: shippings.province,
    zip: shippings.zip
  })
}

export const updateShipping = (userId: number, id: number, data: ShippingValidatorPartial) => {
  return db.update(shippings).set({
    label: data.label,
    recipient: data.recipient,
    street: data.street,
    zip: data.zip,
    province: data.province,
  }).where(
    and(
      eq(shippings.userId, userId),
      eq(shippings.id, id),
    )
  ).returning({
    id: shippings.id,
    label: shippings.label,
    recipient: shippings.recipient,
    street: shippings.street,
    zip: shippings.zip,
    province: shippings.province,
  })
}

export const getUserShipping = (userId: number) => {
  return db.select({
    id: shippings.id,
    label: shippings.label,
    recipient: shippings.recipient,
    street: shippings.street,
    zip: shippings.zip,
    province: shippings.province,
  })
    .from(shippings)
    .where(eq(shippings.userId, userId));
}
