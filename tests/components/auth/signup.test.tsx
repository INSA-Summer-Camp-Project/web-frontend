import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SignupPage from "@/app/(auth)/signup/page";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("SignupPage Component (Telegram-Only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders branding header, telegram signup button, and links", () => {
      render(<SignupPage />);

      expect(screen.getByText("Create an account")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Join ServiceHub today. Secure, passwordless authentication via Telegram.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /continue with telegram/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
        "href",
        "/login",
      );
      expect(
        screen.getByRole("link", { name: /terms of service/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /privacy policy/i }),
      ).toBeInTheDocument();
    });

    it("does not render legacy email/password form elements", () => {
      render(<SignupPage />);

      expect(screen.queryByLabelText("Email Address")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /sign up with email/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/or sign up with email/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Telegram Interaction", () => {
    it("shows loading state when clicking the Telegram signup button", () => {
      render(<SignupPage />);

      const telegramButton = screen.getByRole("button", {
        name: /continue with telegram/i,
      });
      fireEvent.click(telegramButton);

      expect(screen.getByText("Connecting to Telegram...")).toBeInTheDocument();
      expect(telegramButton).toBeDisabled();
    });
  });
});
