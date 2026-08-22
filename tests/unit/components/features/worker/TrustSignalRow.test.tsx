import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustSignalRow } from "@/components/features/worker/TrustSignalRow";
import type { WorkerReputation } from "@/types";

describe("TrustSignalRow", () => {
  const mockReputation: WorkerReputation = {
    workerId: "wrk-1",
    ratingAvg: 4.8,
    totalReviews: 20,
    distribution: { "5": 16, "4": 4, "3": 0, "2": 0, "1": 0 },
    metrics: {
      completedJobs: 42,
      cancelledJobs: 1,
      jobCompletionRate: 0.98,
      repeatCustomers: 11,
    },
    badges: ["Top Rated"],
  };

  it("renders trust signal metrics", () => {
    render(<TrustSignalRow reputation={mockReputation} />);

    expect(screen.getByText("4.8 Rating")).toBeInTheDocument();
    expect(screen.getByText("42 Jobs")).toBeInTheDocument();
    expect(screen.getByText("11 Repeat")).toBeInTheDocument();
    expect(screen.getByText("< 30 mins")).toBeInTheDocument();
  });
});
