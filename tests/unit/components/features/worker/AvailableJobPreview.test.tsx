import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  AvailableJobPreview,
  AvailableJobPreviewSkeleton,
} from "@/components/features/worker/AvailableJobPreview";
import type { Job } from "@/types";

describe("AvailableJobPreview", () => {
  const mockJobs: Job[] = [
    {
      id: "job-1",
      customerId: "cust-1",
      categoryId: "cat-1",
      title: "Fix Kitchen Pipe Leak",
      budget: 450,
      source: "POSTING",
      status: "OPEN",
      category: { id: "cat-1", name: "Plumbing" },
      _count: { applications: 2 },
      createdAt: "2026-08-20T00:00:00.000Z",
    },
  ];

  it("renders job list with title, category, and budget", () => {
    render(<AvailableJobPreview jobs={mockJobs} />);

    expect(screen.getByText("Available Jobs")).toBeInTheDocument();
    expect(screen.getByText("Fix Kitchen Pipe Leak")).toBeInTheDocument();
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("450")).toBeInTheDocument();
    expect(screen.getByText("2 proposals")).toBeInTheDocument();
  });

  it("renders empty state when jobs array is empty", () => {
    render(<AvailableJobPreview jobs={[]} />);

    expect(screen.getByText("No jobs available right now")).toBeInTheDocument();
  });

  it("renders skeleton loading state", () => {
    render(<AvailableJobPreviewSkeleton />);

    expect(screen.getByTestId("available-jobs-skeleton")).toBeInTheDocument();
  });
});
