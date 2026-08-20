import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  MyApplicationsPreview,
  MyApplicationsPreviewSkeleton,
} from "@/components/features/worker/MyApplicationsPreview";
import type { Application } from "@/types";

describe("MyApplicationsPreview", () => {
  const mockApplications: Application[] = [
    {
      id: "app-100",
      jobId: "job-1",
      workerId: "wrk-1",
      proposedPrice: 400,
      estimatedTime: "2 hours",
      status: "PENDING",
      job: {
        id: "job-1",
        customerId: "cust-1",
        categoryId: "cat-1",
        title: "Emergency Pipe Repair",
        budget: 450,
        source: "POSTING",
        status: "OPEN",
        createdAt: "2026-08-20T00:00:00.000Z",
      },
      createdAt: "2026-08-20T00:00:00.000Z",
    },
  ];

  it("renders submitted applications with status and proposed price", () => {
    render(<MyApplicationsPreview applications={mockApplications} />);

    expect(screen.getByText("My Applications")).toBeInTheDocument();
    expect(screen.getByText("Emergency Pipe Repair")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("Est. 2 hours")).toBeInTheDocument();
  });

  it("renders empty state when applications array is empty", () => {
    render(<MyApplicationsPreview applications={[]} />);

    expect(
      screen.getByText("No applications submitted yet"),
    ).toBeInTheDocument();
  });

  it("renders skeleton loading state", () => {
    render(<MyApplicationsPreviewSkeleton />);

    expect(screen.getByTestId("my-applications-skeleton")).toBeInTheDocument();
  });
});
