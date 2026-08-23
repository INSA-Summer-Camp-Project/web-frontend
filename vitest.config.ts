import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    env: {
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_API_URL: "http://localhost:5000",
      NEXT_PUBLIC_TELEGRAM_CLIENT_ID: "test-telegram-client-id",
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "test-cloud-name",
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: "test-upload-preset",
      NODE_ENV: "test",
    },
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
