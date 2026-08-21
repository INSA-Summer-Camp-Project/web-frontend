import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkerSidebar } from "@/components/layout/WorkerSidebar";
import { useAuthStore } from "@/stores/authStore";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/worker/dashboard",
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("WorkerSidebar", () => {
  beforeEach(() => {
    useAuthStore.getState().setUser({
      id: "wrk-1",
      email: "worker@example.com",
      name: "Abebe Mekonnen",
      role: "WORKER",
      lastActiveRole: "WORKER",
    });
  });

  it("renders brand logo and nav items", () => {
    render(<WorkerSidebar />);

    expect(screen.getByText("ServiceHub")).toBeInTheDocument();
    expect(screen.getByText("Worker Portal")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Find Jobs")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders user information in footer", () => {
    render(<WorkerSidebar />);

    expect(screen.getByText("Abebe Mekonnen")).toBeInTheDocument();
    expect(screen.getByText("worker@example.com")).toBeInTheDocument();
  });

  it("calls onLogout callback when logout button is clicked", () => {
    const handleLogout = vi.fn();
    render(<WorkerSidebar onLogout={handleLogout} />);

    const logoutBtn = screen.getByLabelText("Log out");
    fireEvent.click(logoutBtn);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
