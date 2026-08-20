import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workersApi } from "@/lib/api/workers";
import type {
  UpdateWorkerProfilePayload,
  AddPortfolioPayload,
  AddCertificatePayload,
  AddServicePayload,
} from "@/types";

export const workerKeys = {
  all: ["workers"] as const,
  me: () => [...workerKeys.all, "me"] as const,
  myServices: () => [...workerKeys.me(), "services"] as const,
  detail: (id: string) => [...workerKeys.all, id] as const,
  reputation: (id: string) => [...workerKeys.detail(id), "reputation"] as const,
  reviews: (id: string) => [...workerKeys.detail(id), "reviews"] as const,
  categories: () => ["categories"] as const,
};

/**
 * Hook to fetch current authenticated worker profile.
 */
export function useWorkerProfile(enabled = true) {
  return useQuery({
    queryKey: workerKeys.me(),
    queryFn: () => workersApi.getMe(),
    enabled,
  });
}

/**
 * Hook to update current authenticated worker profile.
 */
export function useUpdateWorkerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkerProfilePayload) =>
      workersApi.updateMe(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(workerKeys.me(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: workerKeys.me() });
    },
  });
}

/**
 * Hook to fetch services offered by current worker.
 */
export function useWorkerServices() {
  return useQuery({
    queryKey: workerKeys.myServices(),
    queryFn: () => workersApi.getMyServices(),
  });
}

/**
 * Hook to add a service tag to current worker.
 */
export function useAddWorkerService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddServicePayload) => workersApi.addService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.myServices() });
      queryClient.invalidateQueries({ queryKey: workerKeys.me() });
    },
  });
}

/**
 * Hook to remove a service tag from current worker.
 */
export function useRemoveWorkerService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => workersApi.removeService(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.myServices() });
      queryClient.invalidateQueries({ queryKey: workerKeys.me() });
    },
  });
}

/**
 * Hook to add a portfolio item.
 */
export function useAddPortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddPortfolioPayload) =>
      workersApi.addPortfolio(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.me() });
    },
  });
}

/**
 * Hook to delete a portfolio item.
 */
export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (portfolioId: string) =>
      workersApi.deletePortfolio(portfolioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.me() });
    },
  });
}

/**
 * Hook to add a certificate.
 */
export function useAddCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCertificatePayload) =>
      workersApi.addCertificate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.me() });
    },
  });
}

/**
 * Hook to delete a certificate.
 */
export function useDeleteCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certificateId: string) =>
      workersApi.deleteCertificate(certificateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.me() });
    },
  });
}

/**
 * Hook to fetch a public worker profile by ID.
 */
export function usePublicWorkerProfile(workerId: string, enabled = true) {
  return useQuery({
    queryKey: workerKeys.detail(workerId),
    queryFn: () => workersApi.getById(workerId),
    enabled: !!workerId && enabled,
  });
}

/**
 * Hook to fetch worker reputation, review metrics & badges.
 */
export function useWorkerReputation(workerId: string, enabled = true) {
  return useQuery({
    queryKey: workerKeys.reputation(workerId),
    queryFn: () => workersApi.getReputation(workerId),
    enabled: !!workerId && enabled,
  });
}

/**
 * Hook to fetch customer reviews for a worker.
 */
export function useWorkerReviews(workerId: string, enabled = true) {
  return useQuery({
    queryKey: workerKeys.reviews(workerId),
    queryFn: () => workersApi.getReviews(workerId),
    enabled: !!workerId && enabled,
  });
}

/**
 * Hook to fetch all service categories catalog.
 */
export function useCategories() {
  return useQuery({
    queryKey: workerKeys.categories(),
    queryFn: () => workersApi.getCategories(),
  });
}
