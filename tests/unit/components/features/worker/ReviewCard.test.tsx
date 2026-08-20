import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewCard } from "@/components/features/worker/ReviewCard";
import type { Review } from "@/types";

describe("ReviewCard", () => {
  const mockReview: Review = {
    id: "rev-1",
    rating: 5,
    comment:
      "Outstanding work! Arrived on time and resolved our electrical issue quickly.",
    customer: {
      id: "cust-1",
      name: "Helen Haile",
    },
    job: {
      id: "job-1",
      title: "Switchboard Repair",
      category: {
        id: "cat-1",
        name: "Electrical",
      },
    },
    createdAt: "2026-08-20T00:00:00.000Z",
  };

  it("renders customer name, rating, job category, and comment", () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText("Helen Haile")).toBeInTheDocument();
    expect(screen.getByText("Electrical")).toBeInTheDocument();
    expect(screen.getByText("• Switchboard Repair")).toBeInTheDocument();
    expect(
      screen.getByText(
        "“Outstanding work! Arrived on time and resolved our electrical issue quickly.”",
      ),
    ).toBeInTheDocument();
  });
});
