import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosError,
} from "axios";
import { env } from "@/config/env";
import type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiErrorDetails,
} from "@/types";

export class ApiError extends Error {
  public code?: string;
  public fields?: Record<string, string>;

  constructor(
    public status: number,
    message: string,
    errorDetails?: ApiErrorDetails | string,
  ) {
    super(message);
    this.name = "ApiError";
    if (errorDetails && typeof errorDetails === "object") {
      this.code = errorDetails.code;
      this.fields = errorDetails.fields;
    }
  }
}

// Helper to safely extract error message string from Axios error or response
export function extractErrorMessage(
  error: AxiosError<ApiErrorResponse | unknown>,
): string {
  const errorData = error.response?.data;
  if (errorData && typeof errorData === "object") {
    if ("error" in errorData) {
      const err = (errorData as Record<string, unknown>).error;
      if (typeof err === "string") return err;
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
      ) {
        return (err as { message: string }).message;
      }
    }
  }
  return error.message || "An unexpected network error occurred";
}

// Axios instance configured with base URL and default headers
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Axios response interceptor for handling network and server errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status || 500;
    const message = extractErrorMessage(error);
    const errorDetails = error.response?.data?.error;

    return Promise.reject(new ApiError(status, message, errorDetails));
  },
);

/**
 * Safely unwrap backend response data across various backend envelope conventions:
 * 1. Standard envelope: { success: true, data: T, meta?: M } -> returns data (or includes meta if requested)
 * 2. Root-spread jobs envelope: { success: true, jobs: Job[], meta: M } -> returns { data: jobs, meta, jobs }
 * 3. Raw/Direct payload: array or object without wrapper -> returns payload
 */
export function unwrapResponse<T>(data: unknown): T {
  if (!data || typeof data !== "object") {
    return data as T;
  }

  const record = data as Record<string, unknown>;

  // If response explicitly declares success: false
  if (record.success === false && record.error) {
    const errObj = record.error as ApiErrorDetails | string;
    const errMsg =
      typeof errObj === "string" ? errObj : errObj.message || "API Error";
    throw new ApiError(400, errMsg, errObj);
  }

  // Standard envelope: { success: true, data: T, meta?: M }
  // We return the entire record if meta exists so pagination can use it, 
  // or just the data if no meta exists (for backwards compatibility).
  if ("data" in record && record.data !== undefined) {
    if ("meta" in record) {
      return record as unknown as T;
    }
    return record.data as T;
  }

  return data as T;
}

// Type-safe API client wrapper methods
export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get(url, config);
    return unwrapResponse<T>(response.data);
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosInstance.post(url, data, config);
    return unwrapResponse<T>(response.data);
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosInstance.put(url, data, config);
    return unwrapResponse<T>(response.data);
  },

  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosInstance.patch(url, data, config);
    return unwrapResponse<T>(response.data);
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete(url, config);
    return unwrapResponse<T>(response.data);
  },
};
