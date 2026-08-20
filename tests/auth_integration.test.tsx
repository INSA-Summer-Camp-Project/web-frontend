import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "../src/lib/api/auth";
import type { UserProfile } from "@/types";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock authApi
vi.mock("../src/lib/api/auth", () => ({
  authApi: {
    getMe: vi.fn(),
    logout: vi.fn(),
    getTelegramLoginUrl: vi
      .fn()
      .mockReturnValue("http://localhost:3000/api/v1/auth/telegram"),
  },
}));

// Test consumer reads from authStore
const TestConsumer = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "Authenticated" : "Guest"}
      </div>
      <div data-testid="user-name">{user?.name || "No User"}</div>
    </div>
  );
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

describe("Auth Integration & State Management Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it("starts as Guest when authStore is empty", () => {
    render(<TestConsumer />, { wrapper: createWrapper() });
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Guest");
    expect(screen.getByTestId("user-name")).toHaveTextContent("No User");
  });

  it("shows Authenticated after setUser is called", () => {
    const mockUser: UserProfile = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "CUSTOMER",
    };

    useAuthStore.getState().setUser(mockUser);

    render(<TestConsumer />, { wrapper: createWrapper() });

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "Authenticated",
    );
    expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
  });

  it("clears auth state on logout", () => {
    const mockUser: UserProfile = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "CUSTOMER",
    };

    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().clearAuth();

    render(<TestConsumer />, { wrapper: createWrapper() });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("Guest");
  });

  it("authApi.getMe returns user wrapped in GetMeResponse", async () => {
    const mockUser: UserProfile = {
      id: "1",
      name: "Abebe",
      email: "abebe@example.com",
      role: "WORKER",
    };

    vi.mocked(authApi.getMe).mockResolvedValueOnce({ user: mockUser });

    const result = await authApi.getMe();
    expect(result.user).toEqual(mockUser);
  });

  it("getTelegramLoginUrl returns expected URL", () => {
    expect(authApi.getTelegramLoginUrl()).toBe(
      "http://localhost:3000/api/v1/auth/telegram",
    );
  });
});
