import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Header Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    useAuthStore.getState().clearAuth();
  });

  it("renders user name and role from authStore", () => {
    useAuthStore.getState().setUser({
      id: "usr-1",
      name: "Helen Haile",
      email: "helen@example.com",
      lastActiveRole: "CUSTOMER",
    });

    render(<Header onMenuClick={vi.fn()} />);

    expect(screen.getByText("Helen Haile")).toBeInTheDocument();
    expect(screen.getByText("customer")).toBeInTheDocument();
  });

  it("opens user menu dropdown on click and handles logout", async () => {
    useAuthStore.getState().setUser({
      id: "usr-2",
      name: "Dawit Abebe",
      email: "dawit@example.com",
      lastActiveRole: "CUSTOMER",
    });

    vi.spyOn(authApi, "logout").mockResolvedValueOnce({
      message: "Logged out",
    });

    render(<Header onMenuClick={vi.fn()} />);

    // Click user dropdown
    const userMenuButton = screen.getByRole("button", { name: /user menu/i });
    fireEvent.click(userMenuButton);

    expect(screen.getByText("dawit@example.com")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();

    // Click Logout
    const logoutBtn = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(authApi.logout).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
