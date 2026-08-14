import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Web Sample Test Suite", () => {
  it("renders a simple component", () => {
    render(<div>Hello Web Test</div>);
    expect(screen.getByText("Hello Web Test")).toBeInTheDocument();
  });
});
