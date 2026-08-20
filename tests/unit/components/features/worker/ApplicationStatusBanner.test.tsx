import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApplicationStatusBanner } from "@/components/features/worker/ApplicationStatusBanner";
import type { Application } from "@/types";

describe("ApplicationStatusBanner", () => {
  const mockPendingApplication: Application = {
    id: "app-1",
    jobId: "job-1",
    workerId: "wrk-1",
    proposedPrice: 750,
    estimatedTime: "1 day",
    status: "PENDING",
    createdAt: "2026-08-20T00:00:00.000Z",
  };

  it("renders pending application status banner and proposed price", () => {
    render(<ApplicationStatusBanner application={mockPendingApplication} />);

    expect(screen.getByText("Proposal Under Review")).toBeInTheDocument();
    expect(screen.getByText("750")).toBeInTheDocument();
    expect(screen.getByText("Est. 1 day")).toBeInTheDocument();
  });

  it("opens withdraw confirmation modal and calls onWithdraw", async () => {
    const handleWithdraw = vi.fn();
    render(
      <ApplicationStatusBanner
        application={mockPendingApplication}
        onWithdraw={handleWithdraw}
      />,
    );

    const withdrawBtn = screen.getByRole("button", {
      name: "Withdraw Proposal",
    });
    fireEvent.click(withdrawBtn);

    expect(screen.getByText("Withdraw Proposal?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: "Confirm Withdrawal",
    });
    fireEvent.click(confirmBtn);

    expect(handleWithdraw).toHaveBeenCalledWith("app-1");
  });
});
