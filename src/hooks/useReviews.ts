import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api/reviews";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewQueryParams,
} from "@/types";

export const reviewKeys = {
  all: ["reviews"] as const,
  my: () => [...reviewKeys.all, "my"] as const,
  worker: (workerId: string, params?: ReviewQueryParams) =>
    [...reviewKeys.all, "worker", workerId, { params }] as const,
  customer: (customerId: string, params?: ReviewQueryParams) =>
    [...reviewKeys.all, "customer", customerId, { params }] as const,
};

/**
 * Hook to submit a review for a completed job.
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewsApi.createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/**
 * Hook to update an existing review.
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: UpdateReviewPayload;
    }) => reviewsApi.updateReview(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

/**
 * Hook to delete a review.
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

/**
 * Hook to fetch authenticated user's reviews.
 */
export function useMyReviews(enabled = true) {
  return useQuery({
    queryKey: reviewKeys.my(),
    queryFn: () => reviewsApi.getMyReviews(),
    enabled,
  });
}

/**
 * Hook to fetch reviews for a worker.
 */
export function useWorkerReviews(
  workerId: string,
  params?: ReviewQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: reviewKeys.worker(workerId, params),
    queryFn: () => reviewsApi.getWorkerReviews(workerId, params),
    enabled: !!workerId && enabled,
  });
}

/**
 * Hook to fetch reviews for a customer.
 */
export function useCustomerReviews(
  customerId: string,
  params?: ReviewQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: reviewKeys.customer(customerId, params),
    queryFn: () => reviewsApi.getCustomerReviews(customerId, params),
    enabled: !!customerId && enabled,
  });
}
