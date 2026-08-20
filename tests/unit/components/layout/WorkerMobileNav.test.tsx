import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkerMobileNav } from "@/components/layout/WorkerMobileNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/worker/dashboard",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("WorkerMobileNav", () => {
  it("renders all 5 core worker navigation items", () => {
    render(<WorkerMobileNav />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Find Jobs")).toBeInTheDocument();
    expect(screen.getByText("My Work")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });
});
