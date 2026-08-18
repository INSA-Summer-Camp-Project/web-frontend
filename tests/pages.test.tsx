import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../src/app/(auth)/login/page";
import SignupPage from "../src/app/(auth)/signup/page";
import { loginSchema, registerSchema } from "../src/lib/validations/auth";
import { AuthProvider } from "../src/context/AuthContext";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
    }: {
      children: React.ReactNode;
      href: string;
    }) => <a href={href}>{children}</a>,
  };
});

describe("Auth Validation Schemas Test Suite", () => {
  describe("Zod Auth Schemas", () => {
    it("validates login schema correctly", () => {
      const invalidResult = loginSchema.safeParse({
        email: "invalid",
        password: "",
      });
      expect(invalidResult.success).toBe(false);

      const validResult = loginSchema.safeParse({
        email: "user@example.com",
        password: "secretpassword",
      });
      expect(validResult.success).toBe(true);
    });

    it("validates register schema with role enum and password min length", () => {
      const invalidPassword = registerSchema.safeParse({
        role: "CUSTOMER",
        email: "user@example.com",
        password: "123",
      });
      expect(invalidPassword.success).toBe(false);

      const validRegister = registerSchema.safeParse({
        role: "WORKER",
        email: "worker@example.com",
        password: "securepassword123",
      });
      expect(validRegister.success).toBe(true);
    });
  });

  describe("Login Page Rendering", () => {
    it("renders Telegram login button and welcome title", () => {
      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>,
      );
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login with telegram/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Signup Page Rendering", () => {
    it("renders Telegram signup action and join title", () => {
      render(
        <AuthProvider>
          <SignupPage />
        </AuthProvider>,
      );
      expect(screen.getByText("Join ServiceHub")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up with telegram/i }),
      ).toBeInTheDocument();
    });
  });
});
