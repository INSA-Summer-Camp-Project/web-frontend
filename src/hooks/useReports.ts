import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";
import type {
  Report,
  CreateReportPayload,
  UpdateReportStatusPayload,
} from "@/types";

export const useMyReports = () => {
  return useQuery<Report[], Error>({
    queryKey: ["reports", "my"],
    queryFn: () => reportsApi.getMyReports(),
  });
};

export const useAdminReports = () => {
  return useQuery<Report[], Error>({
    queryKey: ["admin", "reports"],
    queryFn: () => reportsApi.getAdminReports(),
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportPayload) => reportsApi.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "my"] });
      // Don't need to invalidate admin reports here as the user creating the report is not an admin
    },
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateReportStatusPayload;
    }) => reportsApi.updateAdminReportStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
};
