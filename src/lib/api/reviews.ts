import { apiClient } from "@/lib/api";
import type {
  Review,
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewQueryParams,
} from "@/types";

export const reviewsApi = {
  /**
   * POST /api/v1/reviews
   * Submit a review for a completed job.
   */
  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    return apiClient.post<Review>("/api/v1/reviews", payload);
  },

  /**
   * GET /api/v1/reviews/my
   * Fetch authenticated user's reviews (authored or received).
   */
  getMyReviews: async (): Promise<Review[]> => {
    return apiClient.get<Review[]>("/api/v1/reviews/my");
  },

  /**
   * GET /api/v1/workers/:id/reviews
   * Fetch public reviews for a worker.
   */
  getWorkerReviews: async (
    workerId: string,
    params?: ReviewQueryParams,
  ): Promise<Review[]> => {
    return apiClient.get<Review[]>(`/api/v1/workers/${workerId}/reviews`, {
      params,
    });
  },

  /**
   * GET /api/v1/customers/:id/reviews
   * Fetch public reviews for a customer.
   */
  getCustomerReviews: async (
    customerId: string,
    params?: ReviewQueryParams,
  ): Promise<Review[]> => {
    return apiClient.get<Review[]>(`/api/v1/customers/${customerId}/reviews`, {
      params,
    });
  },

  /**
   * PUT /api/v1/reviews/:id
   * Update an existing review within 48 hours.
   */
  updateReview: async (
    reviewId: string,
    payload: UpdateReviewPayload,
  ): Promise<Review> => {
    return apiClient.put<Review>(`/api/v1/reviews/${reviewId}`, payload);
  },

  /**
   * DELETE /api/v1/reviews/:id
   * Delete a review (author or admin).
   */
  deleteReview: async (
    reviewId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/v1/reviews/${reviewId}`,
    );
  },
};
