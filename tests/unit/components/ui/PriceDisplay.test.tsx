import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

describe("PriceDisplay", () => {
  it("formats number with ETB currency by default", () => {
    render(<PriceDisplay amount={12400} />);

    expect(screen.getByText("ETB")).toBeInTheDocument();
    expect(screen.getByText("12,400")).toBeInTheDocument();
  });

  it("handles string amount", () => {
    render(<PriceDisplay amount="500.50" showDecimals />);

    expect(screen.getByText("500.50")).toBeInTheDocument();
  });

  it("renders with prefix and period", () => {
    render(<PriceDisplay amount={40} prefix="From" period="/hr" />);

    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("/hr")).toBeInTheDocument();
  });

  it("supports size variants", () => {
    const { container } = render(<PriceDisplay amount={500} size="xl" />);
    expect(container.firstChild).toHaveClass("text-2xl", "font-serif");
  });
});
