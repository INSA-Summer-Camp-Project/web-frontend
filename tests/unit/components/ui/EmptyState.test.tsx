import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders with title and description", () => {
    render(
      <EmptyState
        title="No jobs found"
        description="Try adjusting your filter criteria"
      />,
    );

    expect(screen.getByText("No jobs found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your filter criteria"),
    ).toBeInTheDocument();
  });

  it("handles CTA button click", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No jobs found"
        actionLabel="Clear Filters"
        onAction={handleAction}
      />,
    );

    const button = screen.getByRole("button", { name: "Clear Filters" });
    fireEvent.click(button);

    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
