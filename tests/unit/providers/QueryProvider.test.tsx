import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryProvider } from "@/providers/QueryProvider";

describe("QueryProvider", () => {
  it("renders children wrapped inside QueryClientProvider", () => {
    render(
      <QueryProvider>
        <div data-testid="test-child">Hello Query Provider</div>
      </QueryProvider>,
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Hello Query Provider")).toBeInTheDocument();
  });
});
