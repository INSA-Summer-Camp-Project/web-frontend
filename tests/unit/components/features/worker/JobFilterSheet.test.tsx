import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JobFilterSheet } from "@/components/features/worker/JobFilterSheet";
import type { JobCategory } from "@/types";

describe("JobFilterSheet", () => {
  const mockCategories: JobCategory[] = [
    { id: "cat-1", name: "Plumbing" },
    { id: "cat-2", name: "Electrical" },
  ];

  it("renders when isOpen is true and shows category chips and budget inputs", () => {
    render(
      <JobFilterSheet
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        onSearchChange={vi.fn()}
        onCategorySelect={vi.fn()}
        onMinBudgetChange={vi.fn()}
        onMaxBudgetChange={vi.fn()}
        onReset={vi.fn()}
        onApply={vi.fn()}
        totalResultsCount={8}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Filter Jobs")).toBeInTheDocument();
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("Show Results (8)")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <JobFilterSheet
        isOpen={false}
        onClose={vi.fn()}
        categories={mockCategories}
        onSearchChange={vi.fn()}
        onCategorySelect={vi.fn()}
        onMinBudgetChange={vi.fn()}
        onMaxBudgetChange={vi.fn()}
        onReset={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles apply and close callbacks", () => {
    const handleApply = vi.fn();
    const handleClose = vi.fn();

    render(
      <JobFilterSheet
        isOpen={true}
        onClose={handleClose}
        categories={mockCategories}
        onSearchChange={vi.fn()}
        onCategorySelect={vi.fn()}
        onMinBudgetChange={vi.fn()}
        onMaxBudgetChange={vi.fn()}
        onReset={vi.fn()}
        onApply={handleApply}
      />,
    );

    const applyButton = screen.getByRole("button", { name: "Apply Filters" });
    fireEvent.click(applyButton);

    expect(handleApply).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
