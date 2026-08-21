import type { Review } from "./worker";

export interface CreateReviewPayload {
  jobId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  rating?: number;
}

export type { Review };
