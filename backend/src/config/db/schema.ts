import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";


const timestamps = {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}

export const users = pgTable(
  'users',
  {
    firstName: varchar("first_name", { length: 256 }),
    lastName: varchar("last_name", { length: 256 }),
    email: varchar("email", { length: 256 }).unique().notNull(),
    password: varchar("password", { length: 33 }).notNull(),
    ...timestamps
  }
)

export const userRelations = relations(users, ({ many }) => ({
  cartItems: many(carts)
}));

export const carts = pgTable('cart_items', {
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id"),
  quantity: integer("quantity"),
  ...timestamps
});

export const cartItemRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  })
}));
