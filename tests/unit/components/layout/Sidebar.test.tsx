import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/customer/dashboard",
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    useAuthStore.getState().clearAuth();
  });

  it("renders customer navigation links and user details", () => {
    useAuthStore.getState().setUser({
      id: "usr-3",
      name: "Tadesse Kebede",
      email: "tadesse@example.com",
      lastActiveRole: "CUSTOMER",
    });

    render(<Sidebar role="CUSTOMER" />);

    expect(screen.getByText("ServiceHub")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("My Jobs")).toBeInTheDocument();
    expect(screen.getByText("Find Workers")).toBeInTheDocument();
    expect(screen.getByText("Tadesse Kebede")).toBeInTheDocument();
  });

  it("triggers logout when footer logout button is clicked", async () => {
    useAuthStore.getState().setUser({
      id: "usr-3",
      name: "Tadesse Kebede",
      email: "tadesse@example.com",
      lastActiveRole: "CUSTOMER",
    });

    vi.spyOn(authApi, "logout").mockResolvedValueOnce({
      message: "Logged out",
    });

    render(<Sidebar role="CUSTOMER" />);

    const logoutBtn = screen.getByRole("button", { name: "Log out" });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(authApi.logout).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
