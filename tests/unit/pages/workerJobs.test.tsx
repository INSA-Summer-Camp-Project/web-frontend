import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkerJobsPage from "@/app/(dashboard)/worker/jobs/page";
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import type { PaginatedJobsResponse, JobCategory, Job, Application } from "@/types";

let mockSearchParams = new URLSearchParams("");

vi.mock("next/navigation", () => ({
  usePathname: () => "/worker/jobs",
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
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
  Wrapper.displayName = "TestJobsWrapper";
  return Wrapper;
}

describe("WorkerJobsPage", () => {
  const mockCategories: JobCategory[] = [
    { id: "cat-1", name: "Plumbing" },
    { id: "cat-2", name: "Electrical" },
  ];

  const mockJobsResponse: PaginatedJobsResponse = {
    data: [
      {
        id: "job-101",
        customerId: "cust-1",
        categoryId: "cat-1",
        title: "Kitchen Sink Leak Fix",
        budget: 600,
        source: "POSTING",
        status: "OPEN",
        category: { id: "cat-1", name: "Plumbing" },
        _count: { applications: 2 },
        createdAt: "2026-08-20T00:00:00.000Z",
      },
    ],
    meta: {
      page: 1,
      limit: 8,
      total: 1,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    mockSearchParams = new URLSearchParams("");
  });

  it("renders header, categories, and job list", async () => {
    vi.spyOn(jobsApi, "getCategories").mockResolvedValueOnce(mockCategories);
    vi.spyOn(jobsApi, "getJobs").mockResolvedValueOnce(mockJobsResponse);

    render(<WorkerJobsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Find Jobs" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Kitchen Sink Leak Fix")).toBeInTheDocument();
      expect(screen.getByText("600")).toBeInTheDocument();
    });
  });

  it("renders empty state when no jobs match filter", async () => {
    const emptyResponse: PaginatedJobsResponse = {
      data: [],
      meta: { page: 1, limit: 8, total: 0, totalPages: 0 },
    };

    vi.spyOn(jobsApi, "getCategories").mockResolvedValueOnce(mockCategories);
    vi.spyOn(jobsApi, "getJobs").mockResolvedValueOnce(emptyResponse);

    render(<WorkerJobsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("No jobs found")).toBeInTheDocument();
    });
  });

  it("renders assigned contracts and proposals when ?tab=my_work is present", async () => {
    mockSearchParams = new URLSearchParams("tab=my_work");

    const mockAssignedJob: Job = {
      id: "job-assigned-1",
      customerId: "cust-1",
      categoryId: "cat-1",
      title: "Living Room Rewiring",
      description: "Full rewiring of living room circuits",
      budget: 1500,
      source: "POSTING",
      status: "IN_PROGRESS",
      category: { id: "cat-1", name: "Electrical" },
      createdAt: "2026-08-20T00:00:00.000Z",
    };

    const mockApplication: Application = {
      id: "app-1",
      jobId: "job-app-1",
      workerId: "wrk-1",
      proposedPrice: 850,
      estimatedTime: "2 days",
      status: "PENDING",
      job: {
        id: "job-app-1",
        title: "Install Water Heater",
        customerId: "cust-2",
        categoryId: "cat-1",
        budget: 900,
        status: "OPEN",
        source: "POSTING",
        createdAt: "2026-08-21T00:00:00.000Z",
      },
      createdAt: "2026-08-21T00:00:00.000Z",
    };

    vi.spyOn(jobsApi, "getMyJobs").mockResolvedValueOnce([mockAssignedJob]);
    vi.spyOn(applicationsApi, "getMyApplications").mockResolvedValueOnce([
      mockApplication,
    ]);

    render(<WorkerJobsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("My Work & Proposals")).toBeInTheDocument();
      expect(screen.getByText("Living Room Rewiring")).toBeInTheDocument();
      expect(screen.getByText("Install Water Heater")).toBeInTheDocument();
      expect(screen.getByText("850")).toBeInTheDocument();
    });
  });
});
