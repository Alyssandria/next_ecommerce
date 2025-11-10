import z from "zod";
import dotenv from "dotenv";

dotenv.config()

type localVars = {
  LOCAL_DB_USER: string,
  LOCAL_DB_DATABASE: string,
  LOCAL_DB_PORT: string,
  LOCAL_DB_HOST: string,
  LOCAL_DB_URI: string,
  LOCAL_DB_PASSWORD: string,
  LOCAL_SERVER_PORT: string
}

const envVars = z.object({
  LOCAL_DB_USER: z.string(),
  LOCAL_DB_DATABASE: z.string(),
  LOCAL_DB_PORT: z.string(),
  LOCAL_DB_HOST: z.string(),
  LOCAL_DB_URI: z.string(),
  LOCAL_DB_PASSWORD: z.string(),
  LOCAL_SERVER_PORT: z.string(),
});

const parse = envVars.parse(process.env);

export const env = {
  local: Object.fromEntries(
    Object.entries(parse).filter(([key]) => key.startsWith("LOCAL"))
  ) as localVars
}
