import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../src/app/(auth)/login/page";
import SignupPage from "../src/app/(auth)/signup/page";

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

describe("Auth Pages Test Suite", () => {
  describe("Login Page", () => {
    it("renders welcome header and login options", () => {
      render(<LoginPage />);
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      expect(screen.getByText("Login with Telegram")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("you@example.com"),
      ).toBeInTheDocument();
      expect(screen.getByText("Create an account")).toBeInTheDocument();
    });

    it("validates email input on email form submission", () => {
      render(<LoginPage />);
      const submitButton = screen.getByRole("button", {
        name: "Continue with Email",
      });
      fireEvent.click(submitButton);
      expect(
        screen.getByText("Please enter a valid email address."),
      ).toBeInTheDocument();
    });
  });

  describe("Signup Page", () => {
    it("renders role selector with CUSTOMER, WORKER, and BUSINESS options", () => {
      render(<SignupPage />);
      expect(screen.getByText("Join ServiceHub")).toBeInTheDocument();
      expect(screen.getByText("I want to hire help")).toBeInTheDocument();
      expect(screen.getByText("I want to offer services")).toBeInTheDocument();
      expect(screen.getByText("I run a business")).toBeInTheDocument();
      expect(screen.getByText("Sign up with Telegram")).toBeInTheDocument();
    });

    it("allows selecting different roles", () => {
      render(<SignupPage />);
      const workerRadio = screen.getByDisplayValue(
        "WORKER",
      ) as HTMLInputElement;
      fireEvent.click(workerRadio);
      expect(workerRadio.checked).toBe(true);

      const businessRadio = screen.getByDisplayValue(
        "BUSINESS",
      ) as HTMLInputElement;
      fireEvent.click(businessRadio);
      expect(businessRadio.checked).toBe(true);
    });
  });
});
