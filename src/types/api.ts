/**
 * Standard API Response Structures for Web Frontend
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface HealthCheckData {
  status: string;
  timestamp: string;
  service: string;
}
