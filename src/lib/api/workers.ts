import { apiClient } from "@/lib/api";
import type {
  WorkerProfile,
  UpdateWorkerProfilePayload,
  WorkerService,
  AddServicePayload,
  PortfolioItem,
  AddPortfolioPayload,
  Certificate,
  AddCertificatePayload,
  WorkerReputation,
  JobCategory,
  Review,
  WorkerSearchParams,
} from "@/types";

export const workersApi = {
  /**
   * GET /api/v1/workers/me
   * Fetches authenticated worker's full profile details.
   */
  getMe: async (): Promise<WorkerProfile> => {
    return apiClient.get<WorkerProfile>("/api/v1/workers/me");
  },

  /**
   * PUT /api/v1/workers/me
   * Updates authenticated worker profile (bio, rate, experience, photo).
   */
  updateMe: async (
    payload: UpdateWorkerProfilePayload,
  ): Promise<WorkerProfile> => {
    return apiClient.put<WorkerProfile>("/api/v1/workers/me", payload);
  },

  /**
   * GET /api/v1/workers/:id
   * Fetches public worker profile.
   */
  getById: async (workerId: string): Promise<WorkerProfile> => {
    return apiClient.get<WorkerProfile>(`/api/v1/workers/${workerId}`);
  },

  /**
   * GET /api/v1/workers/:id/reviews
   * Fetches customer reviews for a worker.
   */
  getReviews: async (workerId: string): Promise<Review[]> => {
    const res = await apiClient.get<
      Review[] | { data: Review[]; meta?: unknown }
    >(`/api/v1/workers/${workerId}/reviews`);
    if (Array.isArray(res)) return res;
    if (
      res &&
      typeof res === "object" &&
      "data" in res &&
      Array.isArray((res as { data: Review[] }).data)
    ) {
      return (res as { data: Review[] }).data;
    }
    return [];
  },

  /**
   * GET /api/v1/workers/me/services
   * Fetches list of categories/services offered by the worker.
   */
  getMyServices: async (): Promise<WorkerService[]> => {
    return apiClient.get<WorkerService[]>("/api/v1/workers/me/services");
  },

  /**
   * POST /api/v1/workers/me/services
   * Adds a service category tag to worker profile.
   */
  addService: async (payload: AddServicePayload): Promise<WorkerService> => {
    return apiClient.post<WorkerService>(
      "/api/v1/workers/me/services",
      payload,
    );
  },

  /**
   * DELETE /api/v1/workers/me/services/:serviceId
   * Removes a service category tag.
   */
  removeService: async (
    serviceId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/v1/workers/me/services/${serviceId}`,
    );
  },

  /**
   * POST /api/v1/workers/me/portfolios
   * Adds a portfolio project with image to worker profile.
   */
  addPortfolio: async (
    payload: AddPortfolioPayload,
  ): Promise<PortfolioItem> => {
    return apiClient.post<PortfolioItem>(
      "/api/v1/workers/me/portfolios",
      payload,
    );
  },

  /**
   * DELETE /api/v1/workers/me/portfolios/:portfolioId
   * Deletes a portfolio item.
   */
  deletePortfolio: async (
    portfolioId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/v1/workers/me/portfolios/${portfolioId}`,
    );
  },

  /**
   * POST /api/v1/workers/me/certificates
   * Adds a professional certificate.
   */
  addCertificate: async (
    payload: AddCertificatePayload,
  ): Promise<Certificate> => {
    return apiClient.post<Certificate>(
      "/api/v1/workers/me/certificates",
      payload,
    );
  },

  /**
   * DELETE /api/v1/workers/me/certificates/:certificateId
   * Deletes a certificate.
   */
  deleteCertificate: async (
    certificateId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/v1/workers/me/certificates/${certificateId}`,
    );
  },

  /**
   * GET /api/v1/workers/:id/reputation
   * Fetches worker ratings distribution, metrics, and trust badges.
   */
  getReputation: async (workerId: string): Promise<WorkerReputation> => {
    return apiClient.get<WorkerReputation>(
      `/api/v1/workers/${workerId}/reputation`,
    );
  },

  /**
   * GET /api/v1/search/providers
   * Searches and filters workers with category, rating, rate, and keyword filters.
   */
  searchWorkers: async (
    params?: WorkerSearchParams,
  ): Promise<WorkerProfile[]> => {
    const res = await apiClient.get<
      WorkerProfile[] | { data: WorkerProfile[]; meta?: unknown }
    >("/api/v1/search/providers", {
      params,
    });
    if (Array.isArray(res)) return res;
    if (
      res &&
      typeof res === "object" &&
      "data" in res &&
      Array.isArray(res.data)
    ) {
      return res.data;
    }
    return [];
  },

  /**
   * GET /api/v1/categories
   * Fetches service categories catalog.
   */
  getCategories: async (): Promise<JobCategory[]> => {
    return apiClient.get<JobCategory[]>("/api/v1/categories");
  },
};
