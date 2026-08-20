import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DirectRespondPanel } from "@/components/features/worker/DirectRespondPanel";

describe("DirectRespondPanel", () => {
  it("renders accept and decline actions", () => {
    render(<DirectRespondPanel jobId="job-1" onRespond={vi.fn()} />);

    expect(screen.getByText("Direct Service Request")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Accept Request" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decline Request" }),
    ).toBeInTheDocument();
  });

  it("handles Accept Request button click", () => {
    const handleRespond = vi.fn();
    render(<DirectRespondPanel jobId="job-1" onRespond={handleRespond} />);

    const acceptBtn = screen.getByRole("button", { name: "Accept Request" });
    fireEvent.click(acceptBtn);

    expect(handleRespond).toHaveBeenCalledWith("ACCEPT");
  });

  it("opens decline modal and triggers DECLINE on confirmation", () => {
    const handleRespond = vi.fn();
    render(<DirectRespondPanel jobId="job-1" onRespond={handleRespond} />);

    const declineBtn = screen.getByRole("button", { name: "Decline Request" });
    fireEvent.click(declineBtn);

    expect(screen.getByText("Decline Direct Request?")).toBeInTheDocument();

    const confirmDeclineBtn = screen.getByRole("button", {
      name: "Confirm Decline",
    });
    fireEvent.click(confirmDeclineBtn);

    expect(handleRespond).toHaveBeenCalledWith("DECLINE");
  });
});
