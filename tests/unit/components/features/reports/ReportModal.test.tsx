import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReportModal } from "@/components/features/reports/ReportModal";
import { reportsApi } from "@/lib/api/reports";
import { toast } from "@/components/ui/Toast";

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
  Wrapper.displayName = "TestReportModalWrapper";
  return { Wrapper, queryClient };
}

describe("ReportModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders when isOpen is true", () => {
    const { Wrapper } = createWrapper();
    render(
      <ReportModal
        isOpen={true}
        onClose={mockOnClose}
        reportedUserId="user-456"
        targetName="Abebe Kebede"
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText("Report Abebe Kebede")).toBeInTheDocument();
    expect(screen.getByLabelText("Reason for reporting")).toBeInTheDocument();
    expect(screen.getByLabelText("Detailed description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit Report" }),
    ).toBeInTheDocument();
  });

  it("validates description minimum length", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");
    const { Wrapper } = createWrapper();
    render(
      <ReportModal
        isOpen={true}
        onClose={mockOnClose}
        reportedUserId="user-456"
        targetName="Abebe Kebede"
      />,
      { wrapper: Wrapper },
    );

    const descInput = screen.getByLabelText("Detailed description");
    fireEvent.change(descInput, { target: { value: "Too short" } });

    fireEvent.click(screen.getByRole("button", { name: "Submit Report" }));

    expect(toastErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("min 10 characters"),
    );
  });

  it("submits valid report and calls onClose", async () => {
    const toastSuccessSpy = vi.spyOn(toast, "success");
    const createSpy = vi
      .spyOn(reportsApi, "createReport")
      .mockResolvedValueOnce({
        id: "report-1",
        reporterId: "user-123",
        reportedId: "user-456",
        reason: "SCAM",
        description: "This worker asked for payment outside the platform.",
        status: "PENDING",
        createdAt: new Date().toISOString(),
      });

    const { Wrapper } = createWrapper();
    render(
      <ReportModal
        isOpen={true}
        onClose={mockOnClose}
        reportedUserId="user-456"
        targetName="Abebe Kebede"
      />,
      { wrapper: Wrapper },
    );

    const reasonSelect = screen.getByLabelText("Reason for reporting");
    fireEvent.change(reasonSelect, { target: { value: "SCAM" } });

    const descInput = screen.getByLabelText("Detailed description");
    fireEvent.change(descInput, {
      target: {
        value: "This worker asked for payment outside the platform.",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit Report" }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        reportedUserId: "user-456",
        jobId: undefined,
        reason: "SCAM",
        description: "This worker asked for payment outside the platform.",
      });
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        expect.stringContaining("Report submitted successfully"),
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
