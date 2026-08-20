import { apiClient } from "@/lib/api";
import type { Job, CreateJobPayload } from "./types";

export const getCustomerJobs = async (): Promise<Job[]> => {
  return apiClient.get<Job[]>("/api/v1/jobs/customer/jobs");
};

export const getWorkerJobs = async (): Promise<Job[]> => {
  return apiClient.get<Job[]>("/api/v1/jobs/worker/jobs");
};

export const createJob = async (data: CreateJobPayload): Promise<Job> => {
  return apiClient.post<Job>("/api/v1/jobs", data);
};

export const getJob = async (id: string): Promise<Job> => {
  return apiClient.get<Job>(`/api/v1/jobs/${id}`);
};

export const getAvailableJobs = async (): Promise<Job[]> => {
  // Assuming the backend might use pagination, but for now we expect an array
  return apiClient.get<Job[]>("/api/v1/jobs/public");
};
