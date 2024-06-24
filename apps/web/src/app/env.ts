import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string(),
    DATABASE_URL: z.string().url(),
    DATABASE_HOST: z.string().min(1),
    DATABASE_PORT: z.string().min(1),
    DATABASE_USER: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_API_URL: z.string().min(1).url(),
    NEXT_PUBLIC_BASE_WEB_URL: z.string().min(1).url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
    NEXT_PUBLIC_BASE_WEB_URL: process.env.NEXT_PUBLIC_BASE_WEB_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
  },
});