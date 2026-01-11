import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  SECRET_KEY: z.string().min(1, "SECRET_KEY is required"),
  REFRESH_KEY: z.string().min(1, "REFRESH_KEY is required"),

  BACKEND_EMAIL: z.string().min(1, "BACKEND_EMAIL is required"),
  EMAIL_PASS: z.string().min(1, "EMAIL_PASS is required"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  PORT: z.coerce.number().default(3000),
  CLIENT_URL: z.string().default("*"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error(
    `\n❌ Invalid environment configuration. Fix the following and restart:\n${issues}\n`
  );
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
