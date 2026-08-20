import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RatingStars } from "@/components/ui/RatingStars";

describe("RatingStars", () => {
  it("renders with rating value and review count", () => {
    render(<RatingStars rating={4.8} showValue totalReviews={126} />);

    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("(126)")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("handles interactive rating selection", () => {
    const handleChange = vi.fn();
    render(<RatingStars rating={0} interactive onChange={handleChange} />);

    const starButtons = screen.getAllByRole("button");
    expect(starButtons).toHaveLength(5);

    fireEvent.click(starButtons[3]); // 4th star -> 4
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("supports compact size", () => {
    const { container } = render(<RatingStars rating={4.5} size="compact" />);
    const starIcon = container.querySelector("svg");
    expect(starIcon).toHaveAttribute("width", "16");
    expect(starIcon).toHaveAttribute("height", "16");
  });
});
