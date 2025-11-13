import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envVars = z.object({
  DB_USER: z.string(),
  DB_URI: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_DATABASE: z.string(),
  DB_PORT: z.string().transform(val => Number(val)),
  SERVER_PORT: z.string(),
  APP_ENV: z.string(),
  APP_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  BASE_PRODUCTS_API: z.string(),
});

export const env = envVars.parse(process.env);
