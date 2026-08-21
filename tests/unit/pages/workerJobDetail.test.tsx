import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkerJobDetailPage from "@/app/(worker)/jobs/[id]/page";
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import type { Job, Application } from "@/types";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "job-100" }),
  usePathname: () => "/worker/jobs/job-100",
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
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

  it("renders job detail card and apply form when user has not applied", async () => {
    vi.spyOn(jobsApi, "getJobById").mockResolvedValueOnce(mockJob);
    vi.spyOn(applicationsApi, "getMyApplications").mockResolvedValueOnce([]);

    render(<WorkerJobDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getAllByText("Master Bedroom Electrical Repair"),
      ).toHaveLength(2);
      expect(
        screen.getByText("Install 4 sockets and 2 light switches."),
      ).toBeInTheDocument();
      expect(screen.getByText("Submit Your Proposal")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit Proposal" }),
      ).toBeInTheDocument();
    });
  });

  it("submits application via applyForm", async () => {
    vi.spyOn(jobsApi, "getJobById").mockResolvedValueOnce(mockJob);
    vi.spyOn(applicationsApi, "getMyApplications").mockResolvedValueOnce([]);
    const applySpy = vi
      .spyOn(applicationsApi, "applyJob")
      .mockResolvedValueOnce({
        id: "app-new",
        jobId: "job-100",
        workerId: "wrk-1",
        proposedPrice: 1100,
        estimatedTime: "1 day",
        status: "PENDING",
      });

    render(<WorkerJobDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Submit Your Proposal")).toBeInTheDocument();
    });

    const timeInput = screen.getByLabelText("Estimated Time (minutes)");
    fireEvent.change(timeInput, { target: { value: "60" } });

    const submitBtn = screen.getByRole("button", { name: "Submit Proposal" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(applySpy).toHaveBeenCalledWith("job-100", {
        proposedPrice: 1200,
        estimatedTime: 60,
      });
    });
  });

  it("renders ApplicationStatusBanner when user has already applied", async () => {
    const mockApp: Application = {
      id: "app-1",
      jobId: "job-100",
      workerId: "wrk-1",
      proposedPrice: 1000,
      estimatedTime: "2 days",
      status: "PENDING",
      createdAt: "2026-08-20T00:00:00.000Z",
    };

    vi.spyOn(jobsApi, "getJobById").mockResolvedValueOnce(mockJob);
    vi.spyOn(applicationsApi, "getMyApplications").mockResolvedValueOnce([
      mockApp,
    ]);

    render(<WorkerJobDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Proposal Under Review")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Withdraw Proposal" }),
      ).toBeInTheDocument();
    });
  });

  it("renders DirectRespondPanel when job is a direct request", async () => {
    const directJob: Job = {
      ...mockJob,
      source: "DIRECT",
      status: "PENDING",
    };

    vi.spyOn(jobsApi, "getJobById").mockResolvedValueOnce(directJob);
    vi.spyOn(applicationsApi, "getMyApplications").mockResolvedValueOnce([]);

    render(<WorkerJobDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Direct Service Request")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Accept Request" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Decline Request" }),
      ).toBeInTheDocument();
    });
  });
});
