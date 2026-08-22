import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/lib/api/applications";
import { jobKeys } from "./useJobs";
import type { ApplyPayload, DirectRespondPayload } from "@/types";
import { jobsApi } from "@/lib/api/jobs";

export const applicationKeys = {
  all: ["applications"] as const,
  mine: () => [...applicationKeys.all, "me"] as const,
  forJob: (jobId: string) => [...applicationKeys.all, jobId] as const,
};

/**
 * Hook to fetch applications submitted by current worker.
 */
export function useMyApplications(enabled = true) {
  return useQuery({
    queryKey: applicationKeys.mine(),
    queryFn: () => applicationsApi.getMyApplications(),
    enabled,
  });
}

/**
 * Hook to fetch applications for a job (Customer / Job Owner).
 */
export function useJobApplications(jobId: string, enabled = true) {
  return useQuery({
    queryKey: applicationKeys.forJob(jobId),
    queryFn: () => applicationsApi.getJobApplications(jobId),
    enabled: !!jobId && enabled,
  });
}

/**
 * Hook to submit an application / bid for a job (Worker).
 * Supports both useApplyJob(jobId) with mutate(payload) and useApplyJob() with mutate({ jobId, ...payload }).
 */
export function useApplyJob(jobId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      jobId?: string;
      proposedPrice: number;
      estimatedTime: string | number;
    }) => {
      const targetJobId = jobId || payload.jobId;
      if (!targetJobId) {
        throw new Error("Job ID is required to submit a proposal");
      }
      return applicationsApi.applyJob(targetJobId, {
        proposedPrice: payload.proposedPrice,
        estimatedTime: String(payload.estimatedTime),
      });
    },
    onSuccess: (_, variables) => {
      const targetJobId = jobId || variables.jobId;
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: applicationKeys.mine() });
      if (targetJobId) {
        queryClient.invalidateQueries({
          queryKey: applicationKeys.forJob(targetJobId),
        });
        queryClient.invalidateQueries({ queryKey: jobKeys.detail(targetJobId) });
      }
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

/**
 * Hook to withdraw an application (Worker).
 */
export function useWithdrawApplication(jobId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationsApi.withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.mine() });
      if (jobId) {
        queryClient.invalidateQueries({
          queryKey: applicationKeys.forJob(jobId),
        });
        queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      }
    },
  });
}

/**
 * Hook to respond to direct booking (Accept / Decline) (Worker).
 */
export function useDirectRespond(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DirectRespondPayload) =>
      jobsApi.directRespond(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.workerJobs() });
    },
  });
}

/**
 * Hook to accept an application and hire the worker (Customer).
 */
export function useAcceptApplication(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationsApi.acceptApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({
        queryKey: applicationKeys.forJob(jobId),
      });
      queryClient.invalidateQueries({ queryKey: jobKeys.customerJobs() });
      queryClient.invalidateQueries({ queryKey: jobKeys.workerJobs() });
    },
  });
}

/**
 * Hook to reject an application (Customer).
 */
export function useRejectApplication(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationsApi.rejectApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationKeys.forJob(jobId),
      });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
    },
  });
}

/**
 * Aliases for compatibility
 */
export const useJobProposals = useJobApplications;
export const useAcceptProposal = (jobId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationsApi.acceptApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      if (jobId) {
        queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
        queryClient.invalidateQueries({
          queryKey: applicationKeys.forJob(jobId),
        });
      }
    },
  });
};
export const useCreateProposal = useApplyJob;
