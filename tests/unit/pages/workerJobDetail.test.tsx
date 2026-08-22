import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkerJobDetailPage from "@/app/(dashboard)/worker/jobs/[id]/page";
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import type { Job } from "@/types";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "job-100" }),
  usePathname: () => "/worker/jobs/job-100",
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
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
  Wrapper.displayName = "TestJobDetailWrapper";
  return Wrapper;
}

describe("WorkerJobDetailPage", () => {
  const mockJob: Job = {
    id: "job-100",
    customerId: "cust-1",
    categoryId: "cat-1",
    title: "Master Bedroom Electrical Repair",
    description: "Install 4 sockets and 2 light switches.",
    budget: 1200,
    source: "POSTING",
    status: "OPEN",
    category: { id: "cat-1", name: "Electrical" },
    _count: { applications: 1 },
    createdAt: "2026-08-20T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders job detail card and submit proposal button", async () => {
    vi.spyOn(jobsApi, "getJobById").mockResolvedValueOnce(mockJob);

    render(<WorkerJobDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByText("Master Bedroom Electrical Repair"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Install 4 sockets and 2 light switches."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit Proposal" }),
      ).toBeInTheDocument();
    });
  });

  it("opens modal and submits proposal", async () => {
    vi.spyOn(jobsApi, "getJobById").mockResolvedValueOnce(mockJob);
    const applySpy = vi
      .spyOn(applicationsApi, "applyJob")
      .mockResolvedValueOnce({
        id: "app-new",
        jobId: "job-100",
        workerId: "wrk-1",
        proposedPrice: 1100,
        estimatedTime: "60",
        status: "PENDING",
      });

    render(<WorkerJobDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Submit Proposal" }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit Proposal" }));

    expect(screen.getByText("Submit a Proposal")).toBeInTheDocument();

    const priceInput = screen.getByLabelText("Your Bid Amount (ETB)");
    const timeInput = screen.getByLabelText("Estimated Time (minutes)");

    fireEvent.change(priceInput, { target: { value: "1100" } });
    fireEvent.change(timeInput, { target: { value: "60" } });

    const submitBtns = screen.getAllByRole("button", {
      name: "Submit Proposal",
    });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    await waitFor(() => {
      expect(applySpy).toHaveBeenCalledWith("job-100", {
        proposedPrice: 1100,
        estimatedTime: "60",
      });
    });
  });
});
