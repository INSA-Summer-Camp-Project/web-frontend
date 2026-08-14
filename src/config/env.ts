import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const result = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
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
  NODE_ENV: "development",
};

export type EnvConfig = typeof env;
