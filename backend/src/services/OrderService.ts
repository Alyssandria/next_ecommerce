import { eq } from "drizzle-orm";
import { db } from "../config/db/db";
import { orderProducts, orders } from "../config/db/schema";
import { OrderValidator } from "../validators/Order";
import { fetchProductsById } from "./ProductService";

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

    const productDataRes = await fetchProductsById(products.map(el => el.productId));

    const productData = await Promise.all(productDataRes.map(async (el) => (
      await el.json()
    )));

    return {
      shipping_id: order.shippingId,
      id: order.id,
      order_no: order.orderNo,
      total: Number(order.total),
      date: order.createdAt,
      products: products.map(el => ({
        product_data: productData.find(x => x.id === el.productId),
        price: Number(el.price),
        name: el.name,
        order_id: el.orderId,
        quantity: el.quantity
      }))
    }
  });
}

export const getUserOrder = async (userId: number, orderNo: string) => {
  const order = await db.query.orders.findFirst({
    where: (order, { eq, and }) => (
      and(eq(order.userId, userId), eq(order.orderNo, orderNo))
    ),
    with: {
      products: true
    },
  })

  if (!order) return null;

  const productDataRes = await fetchProductsById(order.products.map(el => el.productId));

  const productData = await Promise.all(productDataRes.map(async (el) => (
    await el.json()
  )));

  return {
    shipping_id: order.shippingId,
    id: order.id,
    order_no: order.orderNo,
    date: order.createdAt,
    total: Number(order.total),
    products: order.products.map(el => ({
      product_data: productData.find(x => x.id === el.productId),
      price: Number(el.price),
      name: el.name,
      order_id: el.orderId,
      quantity: el.quantity
    }))
  }
}

export const getUserOrders = async (userId: number) => {
  return db.select().from(orders).where(
    eq(orders.userId, userId)
  );
}
