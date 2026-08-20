import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerJobs,
  createJob,
  getJob,
  getAvailableJobs,
  getWorkerJobs,
} from "./api";

export const useCustomerJobs = () => {
  return useQuery({
    queryKey: ["customer", "jobs"],
    queryFn: getCustomerJobs,
  });
};

export const useWorkerJobs = () => {
  return useQuery({
    queryKey: ["worker", "jobs"],
    queryFn: getWorkerJobs,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      // Invalidate the customer jobs query so the new job appears immediately
      queryClient.invalidateQueries({ queryKey: ["customer", "jobs"] });
    },
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });
};

export const useAvailableJobs = () => {
  return useQuery({
    queryKey: ["jobs", "available"],
    queryFn: getAvailableJobs,
  });
};
