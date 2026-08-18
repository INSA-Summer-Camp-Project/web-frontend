import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "../src/lib/api/auth";
import LoginPage from "../src/app/(auth)/login/page";
import SignupPage from "../src/app/(auth)/signup/page";
import { ApiError } from "../src/lib/api";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock authApi
vi.mock("../src/lib/api/auth", () => ({
  authApi: {
    register: vi.fn(),
    login: vi.fn(),
    refreshToken: vi.fn(),
    getMe: vi.fn(),
  },
}));

const TestConsumer = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "Authenticated" : "Guest"}
      </div>
      <div data-testid="user-email">{user?.email || "No User"}</div>
      <button
        onClick={() =>
          login({ email: "test@example.com", password: "password123" })
        }
      >
        Trigger Login
      </button>
      <button onClick={logout}>Trigger Logout</button>
    </div>
  );
};

describe("Auth Integration & State Management Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("AuthContext & Token Management", () => {
    it("logs in user, saves tokens, and updates state", async () => {
      const mockAuthResponse = {
        tokens: { accessToken: "access-123", refreshToken: "refresh-456" },
        user: { id: "1", email: "test@example.com", role: "CUSTOMER" as const },
      };
      vi.mocked(authApi.login).mockResolvedValueOnce(mockAuthResponse);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent("Guest");

      fireEvent.click(screen.getByText("Trigger Login"));

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "Authenticated",
        );
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "test@example.com",
        );
      });

      expect(localStorage.getItem("servicehub_access_token")).toBe(
        "access-123",
      );
      expect(localStorage.getItem("servicehub_refresh_token")).toBe(
        "refresh-456",
      );
    });
  });

  describe("LoginPage API Integration & Error Alerts", () => {
    it("displays error alert when API returns 401 Unauthorized", async () => {
      vi.mocked(authApi.login).mockRejectedValueOnce(
        new ApiError(401, "Invalid email or password."),
      );

      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>,
      );

      fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
        target: { value: "wrong@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "wrongpass" },
      });

      const form = screen
        .getByPlaceholderText("you@example.com")
        .closest("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Invalid email or password.",
        );
      });
    });
  });

  describe("SignupPage API Integration & Error Alerts", () => {
    it("displays error alert when API returns 400 Validation Error", async () => {
      vi.mocked(authApi.register).mockRejectedValueOnce(
        new ApiError(400, "Email is already registered."),
      );

      render(
        <AuthProvider>
          <SignupPage />
        </AuthProvider>,
      );

      fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
        target: { value: "existing@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Min 8 characters"), {
        target: { value: "password123" },
      });

      const form = screen
        .getByPlaceholderText("you@example.com")
        .closest("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Email is already registered.",
        );
      });
    });
  });
});
