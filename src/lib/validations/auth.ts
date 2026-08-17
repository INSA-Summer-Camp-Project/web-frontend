import { z } from "zod";

export const roleEnum = z.enum(["CUSTOMER", "WORKER", "BUSINESS"], {
  errorMap: () => ({ message: "Please select a valid role" }),
});

export type Role = z.infer<typeof roleEnum>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  role: roleEnum,
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
  fullName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Full name must be at least 2 characters long",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
