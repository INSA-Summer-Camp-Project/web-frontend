import { apiClient } from "@/lib/api";
import type {
  Application,
  ApplyPayload,
  AcceptApplicationResponse,
} from "@/types";

export const applicationsApi = {
  /**
   * GET /api/v1/applications/me
   * Fetches applications submitted by the authenticated worker.
   */
  getMyApplications: async (): Promise<Application[]> => {
    return apiClient.get<Application[]>("/api/v1/applications/me");
  },

  /**
   * POST /api/v1/jobs/:jobId/apply
   * Submit an application/bid for a job (Worker).
   */
  applyJob: async (
    jobId: string,
    payload: ApplyPayload,
  ): Promise<Application> => {
    return apiClient.post<Application>(`/api/v1/jobs/${jobId}/apply`, payload);
  },

  /**
   * DELETE /api/v1/applications/:id
   * Withdraw an application (Worker).
   */
  withdrawApplication: async (
    applicationId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/v1/applications/${applicationId}`,
    );
  },

  /**
   * GET /api/v1/jobs/:jobId/applications
   * Fetches all proposals for a job (Customer / Job Owner).
   */
  getJobApplications: async (jobId: string): Promise<Application[]> => {
    return apiClient.get<Application[]>(`/api/v1/jobs/${jobId}/applications`);
  },

  /**
   * POST /api/v1/applications/:id/accept
   * Accept an application and hire the worker (Customer).
   */
  acceptApplication: async (
    applicationId: string,
  ): Promise<AcceptApplicationResponse> => {
    return apiClient.post<AcceptApplicationResponse>(
      `/api/v1/applications/${applicationId}/accept`,
    );
  },

  /**
   * POST /api/v1/applications/:id/reject
   * Reject a worker's bid proposal (Customer).
   */
  rejectApplication: async (applicationId: string): Promise<Application> => {
    return apiClient.post<Application>(
      `/api/v1/applications/${applicationId}/reject`,
    );
  },
};
