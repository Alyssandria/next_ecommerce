import { db } from "../config/db/db"

export const findUser = (id: Number) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, Number(id)),
  });
}
