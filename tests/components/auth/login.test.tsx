import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("LoginPage Component (Telegram-Only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders branding header, telegram login button, and links", () => {
      render(<LoginPage />);

      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Secure, passwordless authentication. Verify your identity in one click.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login with telegram/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /get started/i }),
      ).toHaveAttribute("href", "/signup");
    });

    it("does not render legacy email/password form elements", () => {
      render(<LoginPage />);

      expect(screen.queryByLabelText("Email Address")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /log in with email/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/or continue with/i)).not.toBeInTheDocument();
    });
  });

  describe("Telegram Interaction", () => {
    it("shows loading state when clicking the Telegram login button", () => {
      render(<LoginPage />);

      const telegramButton = screen.getByRole("button", {
        name: /login with telegram/i,
      });
      fireEvent.click(telegramButton);

      expect(screen.getByText("Connecting to Telegram...")).toBeInTheDocument();
      expect(telegramButton).toBeDisabled();
    });
  });
});
