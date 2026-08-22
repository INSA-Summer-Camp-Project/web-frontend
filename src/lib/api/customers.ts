import { apiClient } from "@/lib/api";
import type { Review, ReviewQuery } from "@/types";

export interface CustomerProfileData {
  id: string;
  userId: string;
  bio?: string | null;
  profilePhoto?: string | null;
  ratingAvg: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  totalJobsPosted: number;
  totalCompletedJobs: number;
  reviews?: Review[];
}

export interface UpdateCustomerProfilePayload {
  bio?: string;
  profilePhoto?: string;
}

export const customersApi = {
  getMyProfile: (): Promise<CustomerProfileData> => {
    return apiClient.get<CustomerProfileData>("/api/v1/customers/me");
  },

  updateMyProfile: (
    data: UpdateCustomerProfilePayload,
  ): Promise<CustomerProfileData> => {
    return apiClient.put<CustomerProfileData>("/api/v1/customers/me", data);
  },

  getCustomerById: (id: string): Promise<CustomerProfileData> => {
    return apiClient.get<CustomerProfileData>(`/api/v1/customers/${id}`);
  },

  getCustomerReviews: (
    id: string,
    params?: ReviewQuery,
  ): Promise<{ data: Review[]; meta: { total: number; page: number; limit: number } }> => {
    return apiClient.get(`/api/v1/customers/${id}/reviews`, { params });
  },
};
