import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "@/components/ui/ErrorState";

describe("ErrorState", () => {
  it("renders with alert role, default title and message", () => {
    render(<ErrorState />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("handles retry button click", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} retryLabel="Reload Page" />);

    const retryBtn = screen.getByRole("button", { name: "Reload Page" });
    fireEvent.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
