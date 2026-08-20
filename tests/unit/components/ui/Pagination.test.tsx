import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/ui/Pagination";

describe("Pagination", () => {
  it("renders nothing if totalPages <= 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders pages and handles next/prev clicks", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );

    const prevButton = screen.getByLabelText("Go to previous page");
    const nextButton = screen.getByLabelText("Go to next page");
    const page3Button = screen.getByLabelText("Page 3");

    fireEvent.click(page3Button);
    expect(handlePageChange).toHaveBeenCalledWith(3);

    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("disables previous on first page and next on last page", () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />,
    );
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
    expect(screen.getByLabelText("Go to next page")).not.toBeDisabled();

    rerender(
      <Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />,
    );
    expect(screen.getByLabelText("Go to previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
  });
});
