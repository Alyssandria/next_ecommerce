import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";
import * as schema from "./schema";

const pool = new Pool({
  password: env.local.LOCAL_DB_PASSWORD,
  user: env.local.LOCAL_DB_USER,
  host: env.local.LOCAL_DB_HOST,
  database: env.local.LOCAL_DB_DATABASE,
  port: Number(env.local.LOCAL_DB_PORT)
});

export const db = drizzle({ client: pool, schema: schema, casing: "snake_case" });

