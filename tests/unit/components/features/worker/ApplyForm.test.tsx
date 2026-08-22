import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ApplyForm } from "@/components/features/worker/ApplyForm";

describe("ApplyForm", () => {
  it("renders form fields with default budget and validates inputs", async () => {
    const handleSubmit = vi.fn();
    render(
      <ApplyForm jobId="job-1" defaultBudget={1500} onSubmit={handleSubmit} />,
    );

    expect(screen.getByLabelText("Your Proposed Bid (ETB)")).toHaveValue(1500);

    const submitBtn = screen.getByRole("button", { name: "Submit Proposal" });
    fireEvent.click(submitBtn);

    // Shows validation error for estimatedTime
    await waitFor(() => {
      expect(
        screen.getByText("Please enter an estimated timeline (e.g. 2 hours, 3 days)"),
      ).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data", async () => {
    const handleSubmit = vi.fn();
    render(<ApplyForm jobId="job-1" onSubmit={handleSubmit} />);

    const priceInput = screen.getByLabelText("Your Proposed Bid (ETB)");
    const timeInput = screen.getByLabelText("Estimated Time");

    fireEvent.change(priceInput, { target: { value: "850" } });
    fireEvent.change(timeInput, { target: { value: "4 hours" } });

    const submitBtn = screen.getByRole("button", { name: "Submit Proposal" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        proposedPrice: 850,
        estimatedTime: "4 hours",
      });
    });
  });
});
