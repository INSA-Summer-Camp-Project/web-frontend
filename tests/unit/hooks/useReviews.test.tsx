import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCreateReview,
  useMyReviews,
  useWorkerReviews,
  useCustomerReviews,
} from "@/hooks/useReviews";
import { reviewsApi } from "@/lib/api/reviews";
import type { Review } from "@/types";

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
  Wrapper.displayName = "TestReviewsWrapper";
  return Wrapper;
}

describe("useReviews", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("useMyReviews fetches user reviews", async () => {
    const mockReviews: Review[] = [
      { id: "rev-1", rating: 5, comment: "Top pro" },
    ];
    vi.spyOn(reviewsApi, "getMyReviews").mockResolvedValueOnce(mockReviews);

    const { result } = renderHook(() => useMyReviews(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockReviews);
  });

  it("useWorkerReviews fetches worker reviews", async () => {
    const mockReviews: Review[] = [
      { id: "rev-2", rating: 4, comment: "Great plumbing" },
    ];
    vi.spyOn(reviewsApi, "getWorkerReviews").mockResolvedValueOnce(mockReviews);

    const { result } = renderHook(() => useWorkerReviews("wrk-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockReviews);
  });

  it("useCustomerReviews fetches customer reviews", async () => {
    const mockReviews: Review[] = [
      { id: "rev-3", rating: 5, comment: "Prompt payment" },
    ];
    vi.spyOn(reviewsApi, "getCustomerReviews").mockResolvedValueOnce(
      mockReviews,
    );

    const { result } = renderHook(() => useCustomerReviews("cust-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockReviews);
  });

  it("useCreateReview mutates and creates a review", async () => {
    const mockReview: Review = {
      id: "rev-new",
      jobId: "job-1",
      rating: 5,
      comment: "Excellent job!",
    };
    vi.spyOn(reviewsApi, "createReview").mockResolvedValueOnce(mockReview);

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      jobId: "job-1",
      rating: 5,
      comment: "Excellent job!",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockReview);
  });
});
