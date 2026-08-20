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
} from "@/types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Axios instance configured with base URL and default headers
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
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
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected network error occurred";

    return Promise.reject(new ApiError(status, message));
  },
);

// Type-safe API client wrapper methods
export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    if (!response.data.success) {
      throw new ApiError(
        response.status,
        (response.data as ApiErrorResponse).error,
      );
    }
    return (response.data as ApiSuccessResponse<T>).data;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosInstance.post<ApiResponse<T>>(
      url,
      data,
      config,
    );
    if (!response.data.success) {
      throw new ApiError(
        response.status,
        (response.data as ApiErrorResponse).error,
      );
    }
    return (response.data as ApiSuccessResponse<T>).data;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    if (!response.data.success) {
      throw new ApiError(
        response.status,
        (response.data as ApiErrorResponse).error,
      );
    }
    return (response.data as ApiSuccessResponse<T>).data;
  },

  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await axiosInstance.patch<ApiResponse<T>>(
      url,
      data,
      config,
    );
    if (!response.data.success) {
      throw new ApiError(
        response.status,
        (response.data as ApiErrorResponse).error,
      );
    }
    return (response.data as ApiSuccessResponse<T>).data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    if (!response.data.success) {
      throw new ApiError(
        response.status,
        (response.data as ApiErrorResponse).error,
      );
    }
    return (response.data as ApiSuccessResponse<T>).data;
  },
};
