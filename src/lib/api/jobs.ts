import { apiClient } from "@/lib/api";
import type {
  Job,
  JobCategory,
  JobFilterParams,
  PaginatedJobsResponse,
  CreateJobPayload,
  CreateDirectJobPayload,
  DirectRespondPayload,
  UpdateJobStatusPayload,
} from "@/types";

export const jobsApi = {
  /**
   * GET /api/v1/jobs
   * Browseable public jobs feed with filters & pagination.
   */
  getJobs: async (params?: JobFilterParams): Promise<PaginatedJobsResponse> => {
    return apiClient.get<PaginatedJobsResponse>("/api/v1/jobs", {
      params,
    });
  },

  /**
   * GET /api/v1/jobs/my
   * Authenticated user's jobs (as Customer or Worker).
   */
  getMyJobs: async (): Promise<Job[]> => {
    return apiClient.get<Job[]>("/api/v1/jobs/my");
  },

  /**
   * GET /api/v1/jobs/:id
   * Fetches single job detail.
   */
  getJobById: async (jobId: string): Promise<Job> => {
    return apiClient.get<Job>(`/api/v1/jobs/${jobId}`);
  },

  /**
   * POST /api/v1/jobs
   * Post a new public job (Customer).
   */
  createJob: async (payload: CreateJobPayload): Promise<Job> => {
    return apiClient.post<Job>("/api/v1/jobs", payload);
  },

  /**
   * POST /api/v1/jobs/direct
   * Direct booking for a specific worker (Customer).
   */
  createDirectJob: async (payload: CreateDirectJobPayload): Promise<Job> => {
    return apiClient.post<Job>("/api/v1/jobs/direct", payload);
  },

  /**
   * PATCH /api/v1/jobs/:id/direct-respond
   * Accept or Decline direct booking (Worker).
   */
  directRespond: async (
    jobId: string,
    payload: DirectRespondPayload,
  ): Promise<Job> => {
    return apiClient.patch<Job>(
      `/api/v1/jobs/${jobId}/direct-respond`,
      payload,
    );
  },

  /**
   * PATCH /api/v1/jobs/:id/status
   * Update job status (e.g. COMPLETED).
   */
  updateStatus: async (
    jobId: string,
    payload: UpdateJobStatusPayload,
  ): Promise<Job> => {
    return apiClient.patch<Job>(`/api/v1/jobs/${jobId}/status`, payload);
  },

  /**
   * GET /api/v1/categories
   * Fetches job service categories.
   */
  getCategories: async (): Promise<JobCategory[]> => {
    return apiClient.get<JobCategory[]>("/api/v1/categories");
  },
};
