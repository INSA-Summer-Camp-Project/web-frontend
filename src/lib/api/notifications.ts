import { apiClient } from "@/lib/api";
import type { Notification, UnreadCountResponse } from "@/types";

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const res = await apiClient.get<any>("/api/v1/notifications");
    return res.data ? res.data : res;
  },

  getUnreadCount: (): Promise<UnreadCountResponse> => {
    return apiClient.get<UnreadCountResponse>(
      "/api/v1/notifications/unread-count",
    );
  },

  markAsRead: (id: string): Promise<{ success: boolean }> => {
    return apiClient.patch<{ success: boolean }>(
      `/api/v1/notifications/${id}/read`,
    );
  },

  markAllAsRead: (): Promise<{ success: boolean }> => {
    return apiClient.patch<{ success: boolean }>(
      "/api/v1/notifications/read-all",
    );
  },
};
