import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JobDetailCard } from "@/components/features/worker/JobDetailCard";
import type { Job } from "@/types";

describe("JobDetailCard", () => {
  const mockJob: Job = {
    id: "job-101",
    customerId: "cust-1",
    categoryId: "cat-1",
    title: "Full Plumbing Installation",
    description: "Install copper pipes and fixtures for bathroom.",
    budget: 3500,
    source: "POSTING",
    status: "OPEN",
    location: "Addis Ababa, Kazanchis",
    category: { id: "cat-1", name: "Plumbing" },
    customer: {
      id: "cust-1",
      name: "Tadesse Chala",
      phone: "+251911000000",
      email: "tadesse@example.com",
    },
    _count: { applications: 3 },
    createdAt: "2026-08-20T00:00:00.000Z",
  };

  it("renders job title, full description, customer details, and budget", () => {
    render(<JobDetailCard job={mockJob} />);

    expect(screen.getByText("Full Plumbing Installation")).toBeInTheDocument();
    expect(
      screen.getByText("Install copper pipes and fixtures for bathroom."),
    ).toBeInTheDocument();
    expect(screen.getByText("3,500")).toBeInTheDocument();
    expect(screen.getByText("Tadesse Chala")).toBeInTheDocument();
    expect(screen.getByText("+251911000000")).toBeInTheDocument();
    expect(screen.getByText("3 Proposals")).toBeInTheDocument();
    expect(screen.getByText("Addis Ababa, Kazanchis")).toBeInTheDocument();
  });
});
