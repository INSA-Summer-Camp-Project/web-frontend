import { apiClient } from "@/lib/api";
import type { Notification, UnreadCountResponse } from "@/types";

export const notificationsApi = {
  getNotifications: (): Promise<Notification[]> => {
    return apiClient.get<Notification[]>("/api/v1/notifications");
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
