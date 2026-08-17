import { apiClient, ApiError } from "@/lib/api";
import type {
  RegisterPayload,
  LoginPayload,
  AuthTokens,
  UserProfile,
  AuthResponse,
} from "@/types";

export const authApi = {
  /**
   * POST /api/v1/auth/register
   * Registers a new user with email, password, and role (CUSTOMER | WORKER | BUSINESS).
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      return await apiClient.post<AuthResponse>(
        "/api/v1/auth/register",
        payload,
      );
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Registration failed due to a network error.");
    }
  },

  /**
   * POST /api/v1/auth/login
   * Authenticates user and returns JWT access & refresh tokens.
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      return await apiClient.post<AuthResponse>("/api/v1/auth/login", payload);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, "Invalid email or password.");
    }
  },

  /**
   * POST /api/v1/auth/refresh-token
   * Refreshes JWT access token using token rotation.
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    try {
      return await apiClient.post<AuthTokens>("/api/v1/auth/refresh-token", {
        refreshToken,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  },

  /**
   * GET /api/v1/auth/me
   * Fetches current user profile using Bearer token authorization.
   */
  getMe: async (accessToken?: string): Promise<UserProfile> => {
    try {
      const config = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined;
      return await apiClient.get<UserProfile>("/api/v1/auth/me", config);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, "Unauthorized user profile access.");
    }
  },
};
