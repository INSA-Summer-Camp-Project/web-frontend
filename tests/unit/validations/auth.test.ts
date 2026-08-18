import { describe, it, expect } from "vitest";
import {
  roleEnum,
  loginSchema,
  registerSchema,
  Role,
  genderEnum,
  onboardingSchema,
} from "@/lib/validations/auth";

describe("Auth Validation Schemas Unit Tests", () => {
  describe("roleEnum", () => {
    it("accepts valid roles: CUSTOMER, WORKER, BUSINESS", () => {
      const validRoles: Role[] = ["CUSTOMER", "WORKER", "BUSINESS"];
      validRoles.forEach((role) => {
        const result = roleEnum.safeParse(role);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(role);
        }
      });
    });

    it("rejects invalid role strings with a custom error message", () => {
      const invalidRoles = [
        "ADMIN",
        "SUPERUSER",
        "CLIENT",
        "worker",
        "customer",
        "",
      ];
      invalidRoles.forEach((invalid) => {
        const result = roleEnum.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Please select a valid role",
          );
        }
      });
    });

    it("rejects non-string and null/undefined values", () => {
      expect(roleEnum.safeParse(null).success).toBe(false);
      expect(roleEnum.safeParse(undefined).success).toBe(false);
      expect(roleEnum.safeParse(123).success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    describe("email validation", () => {
      it("fails when email is empty", () => {
        const result = loginSchema.safeParse({
          email: "",
          password: "password123",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const emailError = result.error.format().email?._errors[0];
          expect(emailError).toBe("Email is required");
        }
      });

      it("fails when email format is invalid", () => {
        const invalidEmails = [
          "plainaddress",
          "missingatsign.com",
          "@missingusername.com",
          "user@",
          "user@.com",
          "user@domain..com",
        ];

        invalidEmails.forEach((email) => {
          const result = loginSchema.safeParse({
            email,
            password: "password123",
          });
          expect(result.success).toBe(false);
          if (!result.success) {
            const emailError = result.error.format().email?._errors[0];
            expect(emailError).toBe("Please enter a valid email address");
          }
        });
      });

      it("passes for valid email formats", () => {
        const validEmails = [
          "test@example.com",
          "user.name+tag@sub.domain.co",
          "firstname.lastname@company.org",
        ];

        validEmails.forEach((email) => {
          const result = loginSchema.safeParse({
            email,
            password: "password123",
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("password validation", () => {
      it("fails when password is empty", () => {
        const result = loginSchema.safeParse({
          email: "user@example.com",
          password: "",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const passwordError = result.error.format().password?._errors[0];
          expect(passwordError).toBe("Password is required");
        }
      });

      it("passes when valid email and password are provided", () => {
        const result = loginSchema.safeParse({
          email: "user@example.com",
          password: "anypassword",
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("registerSchema", () => {
    describe("role validation", () => {
      it("requires a valid role choice", () => {
        const result = registerSchema.safeParse({
          role: "INVALID_ROLE",
          email: "user@example.com",
          password: "password123",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.format().role?._errors[0]).toBe(
            "Please select a valid role",
          );
        }
      });

      it("accepts valid roles", () => {
        const roles: Role[] = ["CUSTOMER", "WORKER", "BUSINESS"];
        roles.forEach((role) => {
          const result = registerSchema.safeParse({
            role,
            email: "user@example.com",
            password: "password123",
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("email validation", () => {
      it("fails on empty or invalid email formatting", () => {
        const emptyResult = registerSchema.safeParse({
          role: "CUSTOMER",
          email: "",
          password: "password123",
        });
        expect(emptyResult.success).toBe(false);
        if (!emptyResult.success) {
          expect(emptyResult.error.format().email?._errors[0]).toBe(
            "Email is required",
          );
        }

        const invalidResult = registerSchema.safeParse({
          role: "CUSTOMER",
          email: "not-an-email",
          password: "password123",
        });
        expect(invalidResult.success).toBe(false);
        if (!invalidResult.success) {
          expect(invalidResult.error.format().email?._errors[0]).toBe(
            "Please enter a valid email address",
          );
        }
      });
    });

    describe("password validation rules", () => {
      it("fails when password is empty", () => {
        const result = registerSchema.safeParse({
          role: "CUSTOMER",
          email: "user@example.com",
          password: "",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.format().password?._errors[0]).toBe(
            "Password is required",
          );
        }
      });

      it("fails when password is less than 8 characters", () => {
        const shortPasswords = ["1", "1234", "1234567", "abcdefg"];
        shortPasswords.forEach((password) => {
          const result = registerSchema.safeParse({
            role: "CUSTOMER",
            email: "user@example.com",
            password,
          });
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.format().password?._errors[0]).toBe(
              "Password must be at least 8 characters long",
            );
          }
        });
      });

      it("passes when password is exactly 8 characters or longer", () => {
        const validPasswords = [
          "12345678",
          "password123",
          "extremely-long-secure-password-12345!",
        ];
        validPasswords.forEach((password) => {
          const result = registerSchema.safeParse({
            role: "CUSTOMER",
            email: "user@example.com",
            password,
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("fullName optional validation", () => {
      it("passes when fullName is omitted or empty", () => {
        const omitted = registerSchema.safeParse({
          role: "CUSTOMER",
          email: "user@example.com",
          password: "password123",
        });
        expect(omitted.success).toBe(true);

        const empty = registerSchema.safeParse({
          role: "CUSTOMER",
          email: "user@example.com",
          password: "password123",
          fullName: "",
        });
        expect(empty.success).toBe(true);
      });

      it("fails when fullName is provided with less than 2 characters", () => {
        const result = registerSchema.safeParse({
          role: "CUSTOMER",
          email: "user@example.com",
          password: "password123",
          fullName: "A",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.format().fullName?._errors[0]).toBe(
            "Full name must be at least 2 characters long",
          );
        }
      });

      it("passes when fullName is 2 characters or longer", () => {
        const result = registerSchema.safeParse({
          role: "CUSTOMER",
          email: "user@example.com",
          password: "password123",
          fullName: "John Doe",
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("genderEnum", () => {
    it("accepts valid genders: MALE, FEMALE", () => {
      expect(genderEnum.safeParse("MALE").success).toBe(true);
      expect(genderEnum.safeParse("FEMALE").success).toBe(true);
    });

    it("rejects invalid genders including OTHER", () => {
      expect(genderEnum.safeParse("OTHER").success).toBe(false);
      expect(genderEnum.safeParse("INVALID").success).toBe(false);
      expect(genderEnum.safeParse("").success).toBe(false);
    });
  });

  describe("onboardingSchema", () => {
    it("passes with valid onboarding input", () => {
      const result = onboardingSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        gender: "MALE",
        dateOfBirth: "1990-01-01",
        role: "CUSTOMER",
      });
      expect(result.success).toBe(true);
    });

    it("fails when any required field is missing or invalid", () => {
      const result = onboardingSchema.safeParse({
        firstName: "J",
        lastName: "",
        gender: "OTHER",
        dateOfBirth: "",
        role: "INVALID_ROLE",
      });
      expect(result.success).toBe(false);
    });

    it("fails when date of birth is in the future", () => {
      const result = onboardingSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        gender: "MALE",
        dateOfBirth: "2099-01-01",
        role: "CUSTOMER",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.format().dateOfBirth?._errors[0]).toBe(
          "Date of birth cannot be in the future",
        );
      }
    });
  });
});
