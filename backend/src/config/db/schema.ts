import { relations } from "drizzle-orm";
import { integer, numeric, pgTable, primaryKey, real, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";


const helper = {
  id: serial("id").primaryKey(),
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}

export const users = pgTable(
  'users',
  {
    firstName: varchar("first_name", { length: 256 }).notNull(),
    lastName: varchar("last_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).unique().notNull(),
    password: varchar("password", { length: 64 }).notNull(),
    ...helper
  }
)

export const shippings = pgTable(
  'shipping_details',
  {
    label: varchar("label", { length: 256 }).notNull(),
    recipient: varchar("recipient", { length: 256 }).notNull(),
    street: varchar("street", { length: 256 }).notNull(),
    province: varchar("province", { length: 256 }).notNull(),
    zip: varchar("zip", { length: 4 }).notNull(),
    userId: integer('user_id').references(() => users.id),
    ...helper
  }
)

export const orders = pgTable(
  'orders',
  {
    userId: integer('user_id').references(() => users.id),
    shippingId: integer('shipping_id').references(() => shippings.id),
    orderNo: varchar('order_no', { length: 18 }).unique().notNull(),
    total: numeric('total', { precision: 10, scale: 2, mode: "string" }).notNull(),
    ...helper
  }
);


export const carts = pgTable('cart_items', {
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  ...helper
}, (t) => [
  uniqueIndex('uniqueUserCartItem').on(t.userId, t.productId)
]);


export const orderProducts = pgTable('order_products', {
  price: numeric("price", { precision: 10, scale: 2, mode: "string" }).notNull(),
  quantity: integer("quantity").notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
}, (t) => [
  primaryKey({ columns: [t.productId, t.orderId] }),
  uniqueIndex('uniqueProductOrders').on(t.productId, t.orderId)
]);

export const orderProductRelations = relations(orderProducts, ({ one }) => ({
  order: one(orders, {
    fields: [orderProducts.orderId],
    references: [orders.id]
  }),
}));

export const cartItemRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  }),
}));


export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  shippings: one(shippings, {
    fields: [orders.userId],
    references: [shippings.id]
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  cartItems: many(carts),
  orders: many(orders),
  shippings: many(shippings)
}));
