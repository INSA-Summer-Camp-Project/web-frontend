import { apiClient, ApiError } from "@/lib/api";
import type { UserProfile } from "@/types";

export const authApi = {
  getMe: async (): Promise<UserProfile> => {
    try {
      return await apiClient.get<UserProfile>("/api/v1/auth/me");
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, "Not authenticated.");
    }
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      return await apiClient.post<{ message: string }>("/api/v1/auth/logout");
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Logout failed.");
    }
  },

  getTelegramLoginUrl: (): string => {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/auth/telegram`;
  },
};
