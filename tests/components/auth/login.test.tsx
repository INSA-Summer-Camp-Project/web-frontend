import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import { ApiError } from "@/lib/api";

const mockPush = vi.fn();
const mockLogin = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe("LoginPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders email input, password input, and submit button", () => {
      render(<LoginPage />);

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("you@example.com"),
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /log in with email/i }),
      ).toBeInTheDocument();
    });

    it("renders branding header, telegram button, and links", () => {
      render(<LoginPage />);

      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login with telegram/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /create an account/i }),
      ).toHaveAttribute("href", "/signup");
    });
  });

  describe("Form Validation", () => {
    it("displays validation errors when submitting empty inputs", async () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const form = emailInput.closest("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("displays validation error when entering an invalid email format", async () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const form = emailInput.closest("form")!;

      fireEvent.change(emailInput, {
        target: { value: "invalid-email-format" },
      });
      fireEvent.change(passwordInput, { target: { value: "securepassword" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address"),
        ).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission", () => {
    it("calls login handler and redirects to '/' when inputs are valid", async () => {
      mockLogin.mockResolvedValueOnce(undefined);

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const form = emailInput.closest("form")!;

      fireEvent.change(emailInput, {
        target: { value: "valid.user@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { value: "correctPassword123" },
      });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: "valid.user@example.com",
          password: "correctPassword123",
        });
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("displays server error message when login fails with ApiError", async () => {
      mockLogin.mockRejectedValueOnce(
        new ApiError(401, "Invalid email or password."),
      );

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const form = emailInput.closest("form")!;

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Invalid email or password.",
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
