import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryChip } from "@/components/ui/CategoryChip";

describe("CategoryChip", () => {
  it("renders with label and count", () => {
    render(<CategoryChip label="Plumbing" count={12} />);

    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("handles click toggle", () => {
    const handleToggle = vi.fn();
    render(
      <CategoryChip
        label="Cleaning"
        onToggle={handleToggle}
        selected={false}
      />,
    );

    const chip = screen.getByText("Cleaning");
    fireEvent.click(chip);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("shows selected styles when selected is true", () => {
    const { container } = render(
      <CategoryChip label="Plumbing" selected={true} onToggle={vi.fn()} />,
    );

    expect(container.firstChild).toHaveClass("bg-primary-light");
  });

  it("handles remove button click without triggering toggle", () => {
    const handleToggle = vi.fn();
    const handleRemove = vi.fn();

    render(
      <CategoryChip
        label="Plumbing"
        onToggle={handleToggle}
        onRemove={handleRemove}
      />,
    );

    const removeButton = screen.getByLabelText("Remove Plumbing");
    fireEvent.click(removeButton);

    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleToggle).not.toHaveBeenCalled();
  });
});
