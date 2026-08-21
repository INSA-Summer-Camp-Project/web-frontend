import { describe, it, expect, vi, beforeEach } from "vitest";
import { reviewsApi } from "@/lib/api/reviews";
import { apiClient } from "@/lib/api";

describe("reviewsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("createReview posts a new review", async () => {
    const mockReview = {
      id: "rev-1",
      jobId: "job-1",
      rating: 5,
      comment: "Great work!",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockReview);

    const result = await reviewsApi.createReview({
      jobId: "job-1",
      rating: 5,
      comment: "Great work!",
    });
    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/reviews", {
      jobId: "job-1",
      rating: 5,
      comment: "Great work!",
    });
    expect(result).toEqual(mockReview);
  });

  it("getMyReviews fetches authenticated user reviews", async () => {
    const mockReviews = [{ id: "rev-1", rating: 5 }];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockReviews);

    const result = await reviewsApi.getMyReviews();
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/reviews/my");
    expect(result).toEqual(mockReviews);
  });

  it("getWorkerReviews fetches reviews for a worker", async () => {
    const mockReviews = [{ id: "rev-2", rating: 4 }];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockReviews);

    const result = await reviewsApi.getWorkerReviews("wrk-123", { rating: 5 });
    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/workers/wrk-123/reviews",
      {
        params: { rating: 5 },
      },
    );
    expect(result).toEqual(mockReviews);
  });

  it("getCustomerReviews fetches reviews for a customer", async () => {
    const mockReviews = [{ id: "rev-3", rating: 5 }];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockReviews);

    const result = await reviewsApi.getCustomerReviews("cust-123");
    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/customers/cust-123/reviews",
      {
        params: undefined,
      },
    );
    expect(result).toEqual(mockReviews);
  });

  it("updateReview updates a review", async () => {
    const mockReview = { id: "rev-1", rating: 4, comment: "Updated comment" };
    vi.spyOn(apiClient, "put").mockResolvedValueOnce(mockReview);

    const result = await reviewsApi.updateReview("rev-1", {
      rating: 4,
      comment: "Updated comment",
    });
    expect(apiClient.put).toHaveBeenCalledWith("/api/v1/reviews/rev-1", {
      rating: 4,
      comment: "Updated comment",
    });
    expect(result).toEqual(mockReview);
  });

  it("deleteReview deletes a review", async () => {
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce({
      success: true,
      message: "Deleted",
    });

    const result = await reviewsApi.deleteReview("rev-1");
    expect(apiClient.delete).toHaveBeenCalledWith("/api/v1/reviews/rev-1");
    expect(result.success).toBe(true);
  });
});
