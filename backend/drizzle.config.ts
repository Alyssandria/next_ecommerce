import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/config/db/schema.ts",
  out: "./src/config/db/migrations/",
  dbCredentials: {
    url: process.env.DB_URI!,
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    database: process.env.DB_DATABASE!,
    port: Number(process.env.DB_PORT!),
    password: process.env.DB_PASSWORD!,
    ssl: false,
  }
});
