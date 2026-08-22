import { apiClient } from "@/lib/api";
import type {
  Report,
  CreateReportPayload,
  UpdateReportStatusPayload,
} from "@/types";

export const reportsApi = {
  createReport: (data: CreateReportPayload): Promise<Report> => {
    return apiClient.post<Report>("/api/v1/reports", data);
  },

  getMyReports: (): Promise<Report[]> => {
    return apiClient.get<Report[]>("/api/v1/reports/my-reports");
  },

  getAdminReports: (): Promise<Report[]> => {
    return apiClient.get<Report[]>("/api/v1/admin/reports");
  },

  updateAdminReportStatus: (
    id: string,
    data: UpdateReportStatusPayload,
  ): Promise<Report> => {
    return apiClient.patch<Report>(`/api/v1/admin/reports/${id}/status`, data);
  },
};
