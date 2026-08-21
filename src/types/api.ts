/**
 * Standard API Response Structures for Web Frontend
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T, M = undefined> {
  success: true;
  data: T;
  meta?: M;
}

export interface ApiErrorDetails {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetails | string;
}

export type ApiResponse<T, M = undefined> =
  ApiSuccessResponse<T, M> | ApiErrorResponse;

export interface HealthCheckData {
  status: string;
  timestamp: string;
  service: string;
}
