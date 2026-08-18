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

  describe("LoginPage Telegram Integration", () => {
    it("renders Telegram login action inside AuthProvider", () => {
      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>,
      );

      const telegramBtn = screen.getByRole("button", {
        name: /login with telegram/i,
      });
      expect(telegramBtn).toBeInTheDocument();
    });
  });

  describe("SignupPage Telegram Integration", () => {
    it("renders Telegram signup action inside AuthProvider", () => {
      render(
        <AuthProvider>
          <SignupPage />
        </AuthProvider>,
      );

      const telegramBtn = screen.getByRole("button", {
        name: /sign up with telegram/i,
      });
      expect(telegramBtn).toBeInTheDocument();
    });
  });
});
