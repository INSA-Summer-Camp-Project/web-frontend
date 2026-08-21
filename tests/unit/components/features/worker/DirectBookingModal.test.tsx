import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DirectBookingModal } from "@/components/features/worker/DirectBookingModal";
import { jobsApi } from "@/lib/api/jobs";
import type { WorkerProfile } from "@/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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
  Wrapper.displayName = "TestDirectBookingModalWrapper";
  return Wrapper;
}

describe("DirectBookingModal", () => {
  const mockWorker: WorkerProfile = {
    id: "wrk-99",
    bio: "Electrician",
    payment_rate: 400,
    user: {
      id: "u-99",
      name: "Dawit Haile",
      email: "dawit@example.com",
    },
    services: [
      {
        id: "ws-1",
        categoryId: "cat-elec",
        category: { id: "cat-elec", name: "Electrical" },
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    vi.spyOn(jobsApi, "getCategories").mockResolvedValue([
      { id: "cat-elec", name: "Electrical" },
      { id: "cat-plumb", name: "Plumbing" },
    ]);
  });

  it("renders modal form when isOpen is true", async () => {
    render(
      <DirectBookingModal
        isOpen={true}
        onClose={vi.fn()}
        worker={mockWorker}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText("Hire Dawit Haile")).toBeInTheDocument();
    expect(screen.getByLabelText(/Task \/ Project Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Detailed Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Proposed Total Budget/i)).toBeInTheDocument();
  });

  it("submits direct booking request and redirects to /customer/jobs", async () => {
    vi.spyOn(jobsApi, "createDirectJob").mockResolvedValueOnce({
      id: "job-101",
      categoryId: "cat-elec",
      title: "Fix circuit breaker panel",
      description:
        "Circuit breaker is tripping repeatedly and needs full inspection.",
      budget: 800,
      status: "OPEN",
      source: "DIRECT",
      customerId: "cust-1",
      targetWorkerId: "wrk-99",
      createdAt: "2026-08-21T00:00:00.000Z",
      updatedAt: "2026-08-21T00:00:00.000Z",
    });

    const onCloseMock = vi.fn();

    render(
      <DirectBookingModal
        isOpen={true}
        onClose={onCloseMock}
        worker={mockWorker}
      />,
      { wrapper: createWrapper() },
    );

    // Fill title
    fireEvent.change(screen.getByLabelText(/Task \/ Project Title/i), {
      target: { value: "Fix circuit breaker panel" },
    });

    // Fill description
    fireEvent.change(screen.getByLabelText(/Detailed Description/i), {
      target: {
        value:
          "Circuit breaker is tripping repeatedly and needs full inspection.",
      },
    });

    // Submit form
    fireEvent.click(
      screen.getByRole("button", { name: "Send Direct Request" }),
    );

    await waitFor(() => {
      expect(jobsApi.createDirectJob).toHaveBeenCalledWith({
        targetWorkerId: "wrk-99",
        categoryId: "cat-elec",
        title: "Fix circuit breaker panel",
        description:
          "Circuit breaker is tripping repeatedly and needs full inspection.",
        budget: 800,
      });
      expect(onCloseMock).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/customer/jobs");
    });
  });
});
