import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardShell } from "@/components/layout/DashboardShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/worker/dashboard",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("DashboardShell", () => {
  it("renders desktop sidebar, mobile navigation, and main children", () => {
    render(
      <DashboardShell>
        <div data-testid="dashboard-content">Dashboard Content</div>
      </DashboardShell>,
    );

    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });
});
