import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkerProfileHeader } from "@/components/features/worker/WorkerProfileHeader";
import type { WorkerProfile, WorkerReputation } from "@/types";

describe("WorkerProfileHeader", () => {
  const mockProfile: WorkerProfile = {
    id: "wrk-1",
    bio: "Skilled contractor specializing in residential renovations.",
    experience_years: 7,
    payment_rate: 350,
    profile_photo: "https://example.com/photo.jpg",
    user: {
      id: "u-1",
      name: "Solomon Kassa",
      email: "solomon@example.com",
      phone: "+251911223344",
    },
    _count: {
      completedJobs: 25,
      reviews: 14,
    },
  };

  const mockReputation: WorkerReputation = {
    workerId: "wrk-1",
    rating_avg: 4.9,
    totalReviews: 14,
    distribution: { "5": 12, "4": 2, "3": 0, "2": 0, "1": 0 },
    metrics: {
      completedJobs: 25,
      cancelledJobs: 0,
      jobCompletionRate: 1,
      repeatCustomers: 6,
    },
    badges: ["Verified Provider", "Fast Responder"],
  };

  it("renders worker name, rating, badges, rate, and bio", () => {
    render(
      <WorkerProfileHeader profile={mockProfile} reputation={mockReputation} />,
    );

    expect(screen.getByText("Solomon Kassa")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("(14)")).toBeInTheDocument();
    expect(screen.getByText("Verified Pro")).toBeInTheDocument();
    expect(screen.getByText("Fast Responder")).toBeInTheDocument();
    expect(screen.getByText("350")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Skilled contractor specializing in residential renovations.",
      ),
    ).toBeInTheDocument();
  });

  it("calls onDirectRequest when Direct Booking button is clicked", () => {
    const handleDirectRequest = vi.fn();
    render(
      <WorkerProfileHeader
        profile={mockProfile}
        reputation={mockReputation}
        onDirectRequest={handleDirectRequest}
      />,
    );

    const bookBtn = screen.getByRole("button", { name: "Direct Booking" });
    fireEvent.click(bookBtn);

    expect(handleDirectRequest).toHaveBeenCalled();
  });
});
