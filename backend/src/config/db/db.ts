import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";
import * as schema from "./schema";

const pool = new Pool({
  password: env.DB_PASSWORD,
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_DATABASE,
  port: env.DB_PORT
});

export const db = drizzle({ client: pool, schema: schema, casing: "snake_case" });

