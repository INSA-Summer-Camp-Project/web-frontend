import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api/jobs";
import type {
  JobFilterParams,
  CreateJobPayload,
  CreateDirectJobPayload,
  UpdateJobStatusPayload,
} from "@/types";

export const jobKeys = {
  all: ["jobs"] as const,
  list: (params?: JobFilterParams) => [...jobKeys.all, { params }] as const,
  detail: (id: string) => [...jobKeys.all, id] as const,
  workerJobs: () => ["worker", "jobs"] as const,
  customerJobs: () => ["customer", "jobs"] as const,
  categories: () => ["categories"] as const,
};

/**
 * Hook to fetch job categories.
 */
export function useCategories(enabled = true) {
  return useQuery({
    queryKey: jobKeys.categories(),
    queryFn: () => jobsApi.getCategories(),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch public browseable jobs feed with filters.
 */
export function useJobs(params?: JobFilterParams, enabled = true) {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => jobsApi.getJobs(params),
    enabled,
  });
}

/**
 * Hook to fetch a single job's details.
 */
export function useJobDetail(jobId: string, enabled = true) {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => jobsApi.getJobById(jobId),
    enabled: !!jobId && enabled,
  });
}

/**
 * Hook to fetch worker's assigned / won jobs.
 */
export function useWorkerJobs(enabled = true) {
  return useQuery({
    queryKey: jobKeys.workerJobs(),
    queryFn: () => jobsApi.getMyJobs(),
    enabled,
  });
}

/**
 * Hook to post a new job (Customer).
 */
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => jobsApi.createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.customerJobs() });
    },
  });
}

/**
 * Hook for direct booking a worker (Customer).
 */
export function useCreateDirectJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDirectJobPayload) =>
      jobsApi.createDirectJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.customerJobs() });
    },
  });
}

/**
 * Hook to update job status (e.g., mark as COMPLETED).
 */
export function useUpdateJobStatus(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateJobStatusPayload) =>
      jobsApi.updateStatus(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.workerJobs() });
      queryClient.invalidateQueries({ queryKey: jobKeys.customerJobs() });
    },
  });
}
