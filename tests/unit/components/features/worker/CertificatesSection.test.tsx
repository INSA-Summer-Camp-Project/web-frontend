import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CertificatesSection } from "@/components/features/worker/CertificatesSection";
import { workersApi } from "@/lib/api/workers";
import type { Certificate } from "@/types";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestCertificatesWrapper";
  return Wrapper;
}

describe("CertificatesSection", () => {
  const mockCertificates: Certificate[] = [
    {
      id: "cert-1",
      title: "Master Plumbing Certificate",
      fileUrl: "https://example.com/cert1.pdf",
      issuedDate: "2024-03-10",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders certificate items with view link and issue date", () => {
    render(<CertificatesSection certificates={mockCertificates} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Master Plumbing Certificate")).toBeInTheDocument();
    expect(screen.getByText("Issued Mar 2024")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view document/i }),
    ).toHaveAttribute("href", "https://example.com/cert1.pdf");
  });

  it("opens delete confirmation modal and calls deleteCertificate", async () => {
    const deleteSpy = vi
      .spyOn(workersApi, "deleteCertificate")
      .mockResolvedValueOnce({ success: true, message: "Deleted" });

    render(<CertificatesSection certificates={mockCertificates} />, {
      wrapper: createWrapper(),
    });

    const deleteBtn = screen.getByRole("button", {
      name: "Delete Master Plumbing Certificate",
    });
    fireEvent.click(deleteBtn);

    expect(screen.getByText("Delete Certificate?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: "Delete Certificate",
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("cert-1");
    });
  });

  it("opens add certificate modal when Add Certificate button is clicked", () => {
    render(<CertificatesSection certificates={mockCertificates} />, {
      wrapper: createWrapper(),
    });

    const addBtn = screen.getByRole("button", { name: "Add Certificate" });
    fireEvent.click(addBtn);

    expect(
      screen.getByText("Add Professional Certificate"),
    ).toBeInTheDocument();
  });
});
