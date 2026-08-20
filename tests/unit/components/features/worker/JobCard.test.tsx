import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JobCard } from "@/components/features/worker/JobCard";
import { JobCardSkeleton } from "@/components/features/worker/JobCardSkeleton";
import type { Job } from "@/types";

describe("JobCard", () => {
  const mockJob: Job = {
    id: "job-101",
    customerId: "cust-1",
    categoryId: "cat-1",
    title: "Electrical Rewiring for Living Room",
    description: "Need full replacement of outlets and lighting wiring.",
    budget: 2500,
    source: "POSTING",
    status: "OPEN",
    location: "Addis Ababa, Bole",
    category: { id: "cat-1", name: "Electrical" },
    _count: { applications: 4 },
    createdAt: "2026-08-20T00:00:00.000Z",
  };

  it("renders job title, category, budget, and metadata", () => {
    render(<JobCard job={mockJob} />);

    expect(
      screen.getByText("Electrical Rewiring for Living Room"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Need full replacement of outlets and lighting wiring."),
    ).toBeInTheDocument();
    expect(screen.getByText("Electrical")).toBeInTheDocument();
    expect(screen.getByText("2,500")).toBeInTheDocument();
    expect(screen.getByText("Addis Ababa, Bole")).toBeInTheDocument();
    expect(screen.getByText("4 proposals")).toBeInTheDocument();
  });

  it("calls onApply callback when Apply button is clicked", () => {
    const handleApply = vi.fn();
    render(<JobCard job={mockJob} onApply={handleApply} />);

    const applyButton = screen.getByRole("button", { name: "Apply" });
    fireEvent.click(applyButton);

    expect(handleApply).toHaveBeenCalledWith(mockJob);
  });

  it("renders JobCardSkeleton loading state", () => {
    render(<JobCardSkeleton />);

    expect(screen.getByTestId("job-card-skeleton")).toBeInTheDocument();
  });
});
