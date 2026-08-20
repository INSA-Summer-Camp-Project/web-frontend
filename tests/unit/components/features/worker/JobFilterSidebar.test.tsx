import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JobFilterSidebar } from "@/components/features/worker/JobFilterSidebar";
import type { JobCategory } from "@/types";

describe("JobFilterSidebar", () => {
  const mockCategories: JobCategory[] = [
    { id: "cat-1", name: "Plumbing" },
    { id: "cat-2", name: "Electrical" },
    { id: "cat-3", name: "Carpentry" },
  ];

  it("renders search input, categories, and budget inputs", () => {
    render(
      <JobFilterSidebar
        searchQuery="pipe"
        onSearchChange={vi.fn()}
        categories={mockCategories}
        selectedCategoryId="cat-1"
        onCategorySelect={vi.fn()}
        onMinBudgetChange={vi.fn()}
        onMaxBudgetChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText("Filter Jobs")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Plumbing, Wiring...")).toHaveValue(
      "pipe",
    );
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("Electrical")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Min ETB")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max ETB")).toBeInTheDocument();
  });

  it("handles category selection toggle", () => {
    const handleCategorySelect = vi.fn();
    render(
      <JobFilterSidebar
        categories={mockCategories}
        onSearchChange={vi.fn()}
        onCategorySelect={handleCategorySelect}
        onMinBudgetChange={vi.fn()}
        onMaxBudgetChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    const electricalChip = screen.getByText("Electrical");
    fireEvent.click(electricalChip);

    expect(handleCategorySelect).toHaveBeenCalledWith("cat-2");
  });

  it("handles search input change and reset click", () => {
    const handleSearchChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <JobFilterSidebar
        searchQuery="carpenter"
        categories={mockCategories}
        onSearchChange={handleSearchChange}
        onCategorySelect={vi.fn()}
        onMinBudgetChange={vi.fn()}
        onMaxBudgetChange={vi.fn()}
        onReset={handleReset}
      />,
    );

    const input = screen.getByPlaceholderText("e.g. Plumbing, Wiring...");
    fireEvent.change(input, { target: { value: "repair" } });
    expect(handleSearchChange).toHaveBeenCalledWith("repair");

    const clearButton = screen.getByRole("button", {
      name: "Clear All Filters",
    });
    fireEvent.click(clearButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
