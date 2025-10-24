import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string(),
    MINIO_ENDPOINT: z.string().optional(),
    MINIO_ACCESS_KEY_ID: z.string().optional(),
    MINIO_SECRET_ACCESS_KEY: z.string().optional(),
    MINIO_BUCKET_NAME: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_MINIO_PUBLIC_DOMAIN: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_TRPC_BASE_URL: z.string(),
  },
  runtimeEnv: {
    // =========== SERVER ===========
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_ACCESS_KEY_ID: process.env.MINIO_ACCESS_KEY_ID,
    MINIO_SECRET_ACCESS_KEY: process.env.MINIO_SECRET_ACCESS_KEY,
    MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
    NEXT_PUBLIC_MINIO_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_MINIO_PUBLIC_DOMAIN,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_TRPC_BASE_URL: process.env.NEXT_PUBLIC_TRPC_BASE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
