import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useWorkerProfile,
  useUpdateWorkerProfile,
  useWorkerServices,
  useAddWorkerService,
  useRemoveWorkerService,
  useAddPortfolio,
  useDeletePortfolio,
  useAddCertificate,
  useDeleteCertificate,
  usePublicWorkerProfile,
  useWorkerReputation,
  useCategories,
} from "@/hooks/useWorker";
import { workersApi } from "@/lib/api/workers";
import type {
  WorkerProfile,
  WorkerService,
  PortfolioItem,
  Certificate,
  WorkerReputation,
  JobCategory,
} from "@/types";

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
  Wrapper.displayName = "TestWorkerQueryProviderWrapper";
  return Wrapper;
}

describe("useWorker hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("useWorkerProfile fetches profile", async () => {
    const mockProfile: WorkerProfile = {
      id: "wrk-1",
      bio: "Master Plumber",
    };
    vi.spyOn(workersApi, "getMe").mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => useWorkerProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProfile);
  });

  it("useUpdateWorkerProfile mutates profile", async () => {
    const updated: WorkerProfile = {
      id: "wrk-1",
      payment_rate: 50,
    };
    vi.spyOn(workersApi, "updateMe").mockResolvedValueOnce(updated);

    const { result } = renderHook(() => useUpdateWorkerProfile(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ payment_rate: 50 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updated);
  });

  it("useWorkerServices fetches services", async () => {
    const mockServices: WorkerService[] = [
      {
        id: "srv-1",
        categoryId: "cat-1",
        category: { id: "cat-1", name: "Plumbing" },
      },
    ];
    vi.spyOn(workersApi, "getMyServices").mockResolvedValueOnce(mockServices);

    const { result } = renderHook(() => useWorkerServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockServices);
  });

  it("useAddWorkerService adds a service", async () => {
    const added: WorkerService = {
      id: "srv-2",
      categoryId: "cat-2",
      category: { id: "cat-2", name: "Cleaning" },
    };
    vi.spyOn(workersApi, "addService").mockResolvedValueOnce(added);

    const { result } = renderHook(() => useAddWorkerService(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ categoryId: "cat-2" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(added);
  });

  it("useRemoveWorkerService removes a service", async () => {
    vi.spyOn(workersApi, "removeService").mockResolvedValueOnce({
      success: true,
      message: "Removed",
    });

    const { result } = renderHook(() => useRemoveWorkerService(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("cat-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
  });

  it("useAddPortfolio adds portfolio item", async () => {
    const added: PortfolioItem = {
      id: "port-1",
      title: "Project 1",
      imageUrl: "https://example.com/p.jpg",
    };
    vi.spyOn(workersApi, "addPortfolio").mockResolvedValueOnce(added);

    const { result } = renderHook(() => useAddPortfolio(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Project 1",
      imageUrl: "https://example.com/p.jpg",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(added);
  });

  it("useDeletePortfolio deletes portfolio item", async () => {
    vi.spyOn(workersApi, "deletePortfolio").mockResolvedValueOnce({
      success: true,
      message: "Deleted",
    });

    const { result } = renderHook(() => useDeletePortfolio(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("port-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
  });

  it("useAddCertificate adds certificate item", async () => {
    const added: Certificate = {
      id: "cert-1",
      title: "Cert 1",
      fileUrl: "https://example.com/cert.pdf",
    };
    vi.spyOn(workersApi, "addCertificate").mockResolvedValueOnce(added);

    const { result } = renderHook(() => useAddCertificate(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Cert 1",
      fileUrl: "https://example.com/cert.pdf",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(added);
  });

  it("useDeleteCertificate deletes certificate item", async () => {
    vi.spyOn(workersApi, "deleteCertificate").mockResolvedValueOnce({
      success: true,
      message: "Deleted",
    });

    const { result } = renderHook(() => useDeleteCertificate(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("cert-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
  });

  it("usePublicWorkerProfile fetches public profile", async () => {
    const mockProfile: WorkerProfile = {
      id: "wrk-10",
      bio: "Public profile",
    };
    vi.spyOn(workersApi, "getById").mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => usePublicWorkerProfile("wrk-10"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProfile);
  });

  it("useWorkerReputation fetches reputation stats", async () => {
    const mockRep: WorkerReputation = {
      workerId: "wrk-10",
      rating_avg: 4.8,
      totalReviews: 12,
      distribution: { "5": 10 },
      metrics: {
        completedJobs: 14,
        cancelledJobs: 0,
        jobCompletionRate: 100,
        repeatCustomers: 3,
      },
      badges: ["TOP_RATED"],
    };
    vi.spyOn(workersApi, "getReputation").mockResolvedValueOnce(mockRep);

    const { result } = renderHook(() => useWorkerReputation("wrk-10"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockRep);
  });

  it("useCategories fetches categories list", async () => {
    const mockCats: JobCategory[] = [{ id: "cat-1", name: "Plumbing" }];
    vi.spyOn(workersApi, "getCategories").mockResolvedValueOnce(mockCats);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCats);
  });
});
