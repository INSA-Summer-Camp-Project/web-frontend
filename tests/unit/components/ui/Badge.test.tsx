import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders with text content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("maps status PENDING to warning styling", () => {
    const { container } = render(<Badge status="PENDING" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-warning-light");
  });

  it("maps status COMPLETED to success styling", () => {
    const { container } = render(<Badge status="COMPLETED" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-success-light");
  });

  it("maps status REJECTED to error styling", () => {
    const { container } = render(<Badge status="REJECTED" />);
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-error-light");
  });

  it("maps status OPEN to primary styling", () => {
    const { container } = render(<Badge status="OPEN" />);
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-primary-light");
  });

  it("renders with dot indicator", () => {
    const { container } = render(<Badge dot status="IN_PROGRESS" />);
    const dot = container.querySelector("span > span");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("rounded-full");
  });

  it("supports size variants", () => {
    const { container } = render(<Badge size="lg">Large Badge</Badge>);
    expect(container.firstChild).toHaveClass("text-sm");
  });
});
