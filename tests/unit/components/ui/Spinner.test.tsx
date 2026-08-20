import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "@/components/ui/Spinner";

describe("Spinner", () => {
  it("renders with role status and accessible label", () => {
    render(<Spinner label="Please wait..." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  it("supports color and size variants", () => {
    const { container } = render(<Spinner size="lg" color="accent" />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("w-8", "h-8", "border-accent/20");
  });
});
