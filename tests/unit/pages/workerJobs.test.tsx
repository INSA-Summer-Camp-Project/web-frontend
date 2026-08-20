import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkerJobsPage from "@/app/(worker)/jobs/page";
import { jobsApi } from "@/lib/api/jobs";
import type { PaginatedJobsResponse, JobCategory } from "@/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/worker/jobs",
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
  });

  it("renders header, categories, and job list", async () => {
    vi.spyOn(jobsApi, "getCategories").mockResolvedValueOnce(mockCategories);
    vi.spyOn(jobsApi, "getJobs").mockResolvedValueOnce(mockJobsResponse);

    render(<WorkerJobsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Find Jobs")).toBeInTheDocument();
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
});
