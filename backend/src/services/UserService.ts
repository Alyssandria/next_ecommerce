
import { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query";
import { db } from "../config/db/db";
import { users } from "../config/db/schema";
import { userValidatorPartial, type userValidator } from "../validators/User";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export const findUser = (id: Number) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, Number(id)),
  });
}

export const findUserByEmail = (email: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email)
  });
}

export const createUser = async (data: userValidator) => {
  return db.insert(users).values({
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    password: await bcrypt.hash(data.password, 12),
  }).returning({
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
  });
}

export const updateUser = async (id: number, data: userValidatorPartial) => {
  return db.update(users).set({
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    password: data.password ? await bcrypt.hash(data.password, 12) : undefined
  }).where(eq(users.id, id));
}

export const deleteUser = async (id: number) => {
  return db.delete(users).where(eq(users.id, id));
}

export const getUserCarts = async (id: string) => {
  return users;
}
