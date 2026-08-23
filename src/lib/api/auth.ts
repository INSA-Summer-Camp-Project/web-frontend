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

  getTelegramAuthUrl: async (): Promise<{
    url: string;
    state: string;
    codeVerifier: string;
  }> => {
    try {
      const response = await apiClient.get<{
        url: string;
        state: string;
        codeVerifier: string;
      }>("/api/v1/auth/telegram/url");
      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to retrieve Telegram auth URL.");
    }
  },

  verifyTelegramLogin: async (
    currentUrl: string,
    state: string,
    codeVerifier: string,
  ): Promise<UserProfile> => {
    try {
      return await apiClient.post<UserProfile>("/api/v1/auth/telegram", {
        currentUrl,
        state,
        codeVerifier,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Telegram login verification failed.");
    }
  },

  updateRole: async (
    activeRole: "CUSTOMER" | "WORKER",
  ): Promise<UserProfile> => {
    try {
      return await apiClient.put<UserProfile>("/api/v1/auth/role", {
        activeRole,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update role.");
    }
  },

  getTelegramLoginUrl: (): string => {
    return "/api/v1/auth/telegram";
  },
};
