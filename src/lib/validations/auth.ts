import { z } from "zod";

export const roleEnum = z.enum(["CUSTOMER", "WORKER", "BUSINESS"], {
  error: "Please select a valid role",
});

export type Role = z.infer<typeof roleEnum>;

export const onboardingRoleEnum = z.enum(["CUSTOMER", "WORKER"], {
  error: "Please select a valid role",
});

export type OnboardingRole = z.infer<typeof onboardingRoleEnum>;

export const genderEnum = z.enum(["MALE", "FEMALE"], {
  error: "Please select a gender",
});

export type Gender = z.infer<typeof genderEnum>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  role: roleEnum,
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fullName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Full name must be at least 2 characters long",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters long"),
  gender: genderEnum,
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (val) => {
        if (!val) return false;
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return !isNaN(selectedDate.getTime()) && selectedDate <= today;
      },
      {
        message: "Date of birth cannot be in the future",
      },
    ),
  role: onboardingRoleEnum,
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
