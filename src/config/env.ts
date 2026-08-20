import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().default("demo"),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z
    .string()
    .default("servicehub_unsigned"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const result = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  NODE_ENV: process.env.NODE_ENV,
});

if (!result.success) {
  console.error("❌ Invalid web environment variables:");
  for (const issue of result.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  if (typeof window === "undefined") {
    process.exit(1);
  }
}

export const env = result.data || {
  NEXT_PUBLIC_API_URL: "http://localhost:3000",
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "demo",
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "servicehub_unsigned",
  NODE_ENV: "development",
};

export type EnvConfig = typeof env;
