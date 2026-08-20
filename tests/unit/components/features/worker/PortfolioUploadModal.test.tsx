import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PortfolioUploadModal } from "@/components/features/worker/PortfolioUploadModal";
import * as cloudinary from "@/lib/cloudinary";

describe("PortfolioUploadModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:mock-preview-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("renders when isOpen is true", () => {
    render(
      <PortfolioUploadModal
        isOpen={true}
        onClose={vi.fn()}
        onUpload={vi.fn()}
      />,
    );

    expect(screen.getByText("Add Portfolio Project")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Title")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Project Description (Optional)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Click to upload project photo"),
    ).toBeInTheDocument();
  });

  it("handles title input, file selection, and upload submission", async () => {
    const handleUpload = vi.fn();
    vi.spyOn(cloudinary, "uploadImage").mockResolvedValueOnce(
      "https://cloudinary.com/image.jpg",
    );

    render(
      <PortfolioUploadModal
        isOpen={true}
        onClose={vi.fn()}
        onUpload={handleUpload}
      />,
    );

    const titleInput = screen.getByLabelText("Project Title");
    fireEvent.change(titleInput, {
      target: { value: "Kitchen Counter Granite" },
    });

    const file = new File(["dummy image"], "counter.png", {
      type: "image/png",
    });
    const fileInput = document.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitBtn = screen.getByRole("button", { name: "Save Project" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(cloudinary.uploadImage).toHaveBeenCalledWith(
        file,
        "servicehub/portfolio",
      );
      expect(handleUpload).toHaveBeenCalledWith({
        title: "Kitchen Counter Granite",
        description: undefined,
        imageUrl: "https://cloudinary.com/image.jpg",
      });
    });
  });
});
