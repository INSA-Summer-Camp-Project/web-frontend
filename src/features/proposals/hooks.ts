import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Proposal, CreateProposalPayload } from "./types";
import { toast } from "@/components/ui/Toast";
import { apiClient } from "@/lib/api";

export const useJobProposals = (jobId: string) => {
  return useQuery({
    queryKey: ["proposals", jobId],
    queryFn: async (): Promise<Proposal[]> => {
      return apiClient.get<Proposal[]>(`/api/v1/applications/job/${jobId}`);
    },
  });
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProposalPayload): Promise<Proposal> => {
      return apiClient.post<Proposal>("/api/v1/applications", {
        jobId: payload.jobId,
        proposedPrice: payload.proposedPrice,
        estimatedTime: payload.estimatedTime,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["proposals", variables.jobId],
      });
      toast.success("Proposal submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit proposal. Please try again.");
    },
  });
};

export const useAcceptProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: string): Promise<void> => {
      return apiClient.patch(`/api/v1/applications/${proposalId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Proposal accepted!");
    },
    onError: () => {
      toast.error("Failed to accept proposal.");
    },
  });
};
