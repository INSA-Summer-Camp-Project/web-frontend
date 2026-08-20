import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("renders when isOpen is true", () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Add Portfolio"
        description="Upload a photo"
      >
        <div>Modal Body Content</div>
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Upload a photo")).toBeInTheDocument();
    expect(screen.getByText("Modal Body Content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Add Portfolio">
        <div>Modal Body Content</div>
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Add Portfolio">
        <div>Body</div>
      </Modal>,
    );

    const closeButton = screen.getByLabelText("Close dialog");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Body</div>
      </Modal>,
    );

    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape key press", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Body</div>
      </Modal>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
