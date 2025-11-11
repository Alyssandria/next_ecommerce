import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, unique, uniqueIndex, varchar } from "drizzle-orm/pg-core";


const helper = {
  id: serial("id").primaryKey(),
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}

export const users = pgTable(
  'users',
  {
    firstName: varchar("first_name", { length: 256 }),
    lastName: varchar("last_name", { length: 256 }),
    email: varchar("email", { length: 256 }).unique().notNull(),
    password: varchar("password", { length: 64 }).notNull(),
    ...helper
  }
)

export const carts = pgTable('cart_items', {
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id"),
  quantity: integer("quantity"),
  ...helper
}, (t) => [
  uniqueIndex('uniqueUserCartItem').on(t.userId, t.productId)
]);

export const cartItemRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  })
}));

export const userRelations = relations(users, ({ many }) => ({
  cartItems: many(carts)
}));
