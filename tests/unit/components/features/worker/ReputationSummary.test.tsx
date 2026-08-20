import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReputationSummary } from "@/components/features/worker/ReputationSummary";
import type { WorkerReputation } from "@/types";

describe("ReputationSummary", () => {
  const mockReputation: WorkerReputation = {
    workerId: "wrk-1",
    rating_avg: 4.8,
    totalReviews: 25,
    distribution: { "5": 20, "4": 5, "3": 0, "2": 0, "1": 0 },
    metrics: {
      completedJobs: 40,
      cancelledJobs: 0,
      jobCompletionRate: 1,
      repeatCustomers: 8,
    },
    badges: ["Top Rated"],
  };

  it("renders average rating score and breakdown percentage bars", () => {
    render(<ReputationSummary reputation={mockReputation} />);

    expect(screen.getByText("Ratings & Reviews")).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(
      screen.getByText("Based on 25 verified reviews"),
    ).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });
});
