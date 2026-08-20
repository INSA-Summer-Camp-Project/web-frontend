import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CertificateUploadModal } from "@/components/features/worker/CertificateUploadModal";
import * as cloudinary from "@/lib/cloudinary";

describe("CertificateUploadModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders when isOpen is true", () => {
    render(
      <CertificateUploadModal
        isOpen={true}
        onClose={vi.fn()}
        onUpload={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Add Professional Certificate"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Certificate / Qualification Title"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Issued Date")).toBeInTheDocument();
    expect(
      screen.getByText("Click to upload certificate document"),
    ).toBeInTheDocument();
  });

  it("handles title, issue date, file upload, and submission", async () => {
    const handleUpload = vi.fn();
    vi.spyOn(cloudinary, "uploadDocument").mockResolvedValueOnce(
      "https://cloudinary.com/cert.pdf",
    );

    render(
      <CertificateUploadModal
        isOpen={true}
        onClose={vi.fn()}
        onUpload={handleUpload}
      />,
    );

    const titleInput = screen.getByLabelText(
      "Certificate / Qualification Title",
    );
    fireEvent.change(titleInput, { target: { value: "Licensed Electrician" } });

    const dateInput = screen.getByLabelText("Issued Date");
    fireEvent.change(dateInput, { target: { value: "2024-05-15" } });

    const file = new File(["dummy pdf"], "license.pdf", {
      type: "application/pdf",
    });
    const fileInput = document.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitBtn = screen.getByRole("button", { name: "Save Certificate" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(cloudinary.uploadDocument).toHaveBeenCalledWith(
        file,
        "servicehub/certificates",
      );
      expect(handleUpload).toHaveBeenCalledWith({
        title: "Licensed Electrician",
        issueDate: "2024-05-15",
        fileUrl: "https://cloudinary.com/cert.pdf",
      });
    });
  });
});
