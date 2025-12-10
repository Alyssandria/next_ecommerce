import { and, eq } from "drizzle-orm";
import { db } from "../config/db/db";
import { orderProducts, orders } from "../config/db/schema";
import { OrderValidator } from "../validators/Order";

export const createOrder = async (userId: number, data: OrderValidator) => {
  return db.transaction(async tx => {
    const [order] = await tx.insert(orders).values({
      shippingId: data.shipping_id,
      total: data.total,
      userId,
      orderNo: data.order_no
    }).returning();

    const products = await Promise.all(data.products.map(async product => {
      const [row] = await tx.insert(orderProducts).values({
        name: product.name,
        price: product.price,
        orderId: order.id,
        quantity: product.quantity,
        productId: product.product_id
      }).returning();

      return row;
    }));

    return {
      shipping_id: order.shippingId,
      id: order.id,
      order_no: order.orderNo,
      total: Number(order.total),
      products
    }
  });
}

export const getUserOrder = async (userId: number, orderNo: string) => {
  return db.query.orders.findFirst({
    where: (order, { eq, and }) => (
      and(eq(order.userId, userId), eq(order.orderNo, orderNo))
    ),
    with: {
      products: true
    }
  })
}

export const getUserOrders = async (userId: number) => {
  return db.select().from(orders).where(
    eq(orders.userId, userId)
  );
}
