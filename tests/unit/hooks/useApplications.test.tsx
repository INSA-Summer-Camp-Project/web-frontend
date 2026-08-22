import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useMyApplications,
  useJobApplications,
  useApplyJob,
  useWithdrawApplication,
  useDirectRespond,
  useAcceptApplication,
  useRejectApplication,
  useCreateProposal,
} from "@/hooks/useApplications";
import { applicationsApi } from "@/lib/api/applications";
import { jobsApi } from "@/lib/api/jobs";
import type { Application, Job, AcceptApplicationResponse } from "@/types";

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
  Wrapper.displayName = "TestApplicationsQueryProviderWrapper";
  return Wrapper;
}

describe("useApplications hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("useMyApplications fetches worker applications", async () => {
    const mockApps: Application[] = [
      {
        id: "app-1",
        jobId: "job-1",
        workerId: "wrk-1",
        proposedPrice: 100,
        estimatedTime: "2 hours",
        status: "PENDING",
      },
    ];
    vi.spyOn(applicationsApi, "getMyApplications").mockResolvedValueOnce(
      mockApps,
    );

    const { result } = renderHook(() => useMyApplications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockApps);
  });

  it("useJobApplications fetches applications for a job", async () => {
    const mockApps: Application[] = [
      {
        id: "app-1",
        jobId: "job-100",
        workerId: "wrk-1",
        proposedPrice: 100,
        estimatedTime: "2 hours",
        status: "PENDING",
      },
    ];
    vi.spyOn(applicationsApi, "getJobApplications").mockResolvedValueOnce(
      mockApps,
    );

    const { result } = renderHook(() => useJobApplications("job-100"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockApps);
  });

  it("useApplyJob submits a proposal", async () => {
    const createdApp: Application = {
      id: "app-1",
      jobId: "job-100",
      workerId: "wrk-1",
      proposedPrice: 80,
      estimatedTime: "1 hour",
      status: "PENDING",
    };
    vi.spyOn(applicationsApi, "applyJob").mockResolvedValueOnce(createdApp);

    const { result } = renderHook(() => useApplyJob("job-100"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      proposedPrice: 80,
      estimatedTime: "60 minutes",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(createdApp);
  });

  it("useWithdrawApplication deletes application", async () => {
    vi.spyOn(applicationsApi, "withdrawApplication").mockResolvedValueOnce({
      success: true,
      message: "Withdrawn",
    });

    const { result } = renderHook(() => useWithdrawApplication("job-100"), {
      wrapper: createWrapper(),
    });

    result.current.mutate("app-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
  });

  it("useDirectRespond accepts or declines booking", async () => {
    const updatedJob: Job = {
      id: "job-100",
      customerId: "cust-1",
      categoryId: "cat-1",
      title: "Direct Job",
      budget: 100,
      source: "DIRECT",
      status: "IN_PROGRESS",
      createdAt: "2026-08-20T00:00:00.000Z",
    };
    vi.spyOn(jobsApi, "directRespond").mockResolvedValueOnce(updatedJob);

    const { result } = renderHook(() => useDirectRespond("job-100"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ action: "ACCEPT" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updatedJob);
  });

  it("useAcceptApplication accepts application", async () => {
    const acceptRes: AcceptApplicationResponse = {
      message: "Hired",
      jobId: "job-100",
      assignedWorkerId: "wrk-1",
      agreedBudget: 80,
      status: "IN_PROGRESS",
    };
    vi.spyOn(applicationsApi, "acceptApplication").mockResolvedValueOnce(
      acceptRes,
    );

    const { result } = renderHook(() => useAcceptApplication("job-100"), {
      wrapper: createWrapper(),
    });

    result.current.mutate("app-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(acceptRes);
  });

  it("useRejectApplication rejects proposal", async () => {
    const rejectedApp: Application = {
      id: "app-1",
      jobId: "job-100",
      workerId: "wrk-1",
      proposedPrice: 80,
      estimatedTime: "1 hour",
      status: "REJECTED",
    };
    vi.spyOn(applicationsApi, "rejectApplication").mockResolvedValueOnce(
      rejectedApp,
    );

    const { result } = renderHook(() => useRejectApplication("job-100"), {
      wrapper: createWrapper(),
    });

    result.current.mutate("app-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(rejectedApp);
  });

  it("useCreateProposal submits a proposal with payload containing jobId", async () => {
    const createdApp: Application = {
      id: "app-2",
      jobId: "job-200",
      workerId: "wrk-1",
      proposedPrice: 120,
      estimatedTime: "2 hours",
      status: "PENDING",
    };
    const spy = vi
      .spyOn(applicationsApi, "applyJob")
      .mockResolvedValueOnce(createdApp);

    const { result } = renderHook(() => useCreateProposal(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      jobId: "job-200",
      proposedPrice: 120,
      estimatedTime: "2 hours",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(createdApp);
    expect(spy).toHaveBeenCalledWith("job-200", {
      proposedPrice: 120,
      estimatedTime: "2 hours",
    });
  });
});
