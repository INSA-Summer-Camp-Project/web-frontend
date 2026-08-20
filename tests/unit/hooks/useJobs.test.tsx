import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useJobs,
  useJobDetail,
  useWorkerJobs,
  useCreateJob,
  useCreateDirectJob,
  useUpdateJobStatus,
} from "@/hooks/useJobs";
import { jobsApi } from "@/lib/api/jobs";
import type { Job, PaginatedJobsResponse } from "@/types";

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
  Wrapper.displayName = "TestJobsQueryProviderWrapper";
  return Wrapper;
}

describe("useJobs hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("useJobs fetches paginated job list", async () => {
    const mockJobsResponse: PaginatedJobsResponse = {
      data: [
        {
          id: "job-1",
          customerId: "cust-1",
          categoryId: "cat-1",
          title: "Fix Pipe",
          budget: 100,
          source: "POSTING",
          status: "OPEN",
          createdAt: "2026-08-20T00:00:00.000Z",
        },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    vi.spyOn(jobsApi, "getJobs").mockResolvedValueOnce(mockJobsResponse);

    const { result } = renderHook(() => useJobs({ q: "Pipe" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockJobsResponse);
  });

  it("useJobDetail fetches single job", async () => {
    const mockJob: Job = {
      id: "job-101",
      customerId: "cust-1",
      categoryId: "cat-1",
      title: "Fix Pipe",
      budget: 100,
      source: "POSTING",
      status: "OPEN",
      createdAt: "2026-08-20T00:00:00.000Z",
    };
    vi.spyOn(jobsApi, "getJobById").mockResolvedValueOnce(mockJob);

    const { result } = renderHook(() => useJobDetail("job-101"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockJob);
  });

  it("useWorkerJobs fetches assigned worker jobs", async () => {
    const mockJobs: Job[] = [
      {
        id: "job-101",
        customerId: "cust-1",
        categoryId: "cat-1",
        title: "Fix Pipe",
        budget: 100,
        source: "POSTING",
        status: "IN_PROGRESS",
        createdAt: "2026-08-20T00:00:00.000Z",
      },
    ];
    vi.spyOn(jobsApi, "getMyJobs").mockResolvedValueOnce(mockJobs);

    const { result } = renderHook(() => useWorkerJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockJobs);
  });

  it("useCreateJob creates a new job", async () => {
    const createdJob: Job = {
      id: "job-200",
      customerId: "cust-1",
      categoryId: "cat-1",
      title: "New Job",
      budget: 100,
      source: "POSTING",
      status: "OPEN",
      createdAt: "2026-08-20T00:00:00.000Z",
    };
    vi.spyOn(jobsApi, "createJob").mockResolvedValueOnce(createdJob);

    const { result } = renderHook(() => useCreateJob(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      categoryId: "cat-1",
      title: "New Job",
      description: "Description",
      budget: 100,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(createdJob);
  });

  it("useCreateDirectJob creates a direct booking", async () => {
    const createdJob: Job = {
      id: "job-201",
      customerId: "cust-1",
      categoryId: "cat-1",
      title: "Direct Booking",
      budget: 120,
      source: "DIRECT",
      status: "PENDING",
      createdAt: "2026-08-20T00:00:00.000Z",
    };
    vi.spyOn(jobsApi, "createDirectJob").mockResolvedValueOnce(createdJob);

    const { result } = renderHook(() => useCreateDirectJob(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      targetWorkerId: "wrk-1",
      categoryId: "cat-1",
      title: "Direct Booking",
      description: "Description",
      budget: 120,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(createdJob);
  });

  it("useUpdateJobStatus updates status", async () => {
    const updatedJob: Job = {
      id: "job-101",
      customerId: "cust-1",
      categoryId: "cat-1",
      title: "Fix Pipe",
      budget: 100,
      source: "POSTING",
      status: "COMPLETED",
      createdAt: "2026-08-20T00:00:00.000Z",
    };
    vi.spyOn(jobsApi, "updateStatus").mockResolvedValueOnce(updatedJob);

    const { result } = renderHook(() => useUpdateJobStatus("job-101"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ status: "COMPLETED" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updatedJob);
  });
});
