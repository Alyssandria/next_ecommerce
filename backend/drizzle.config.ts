import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/config/db/schema.ts",
  out: "./src/config/db/migrations/",
  dbCredentials: {
    host: process.env.APP_ENV === 'local' ? process.env.LOCAL_DB_HOST ?? "" : "",
    user: process.env.APP_ENV === 'local' ? process.env.LOCAL_DB_USER ?? "" : "",
    database: process.env.APP_ENV === 'local' ? process.env.LOCAL_DB_DATABASE ?? "" : "",
    port: process.env.APP_ENV === 'local' ? Number(process.env.LOCAL_DB_PORT) : undefined,
    password: process.env.APP_ENV === 'local' ? process.env.LOCAL_DB_PASSWORD ?? "" : "",
    ssl: false,
  }
});
