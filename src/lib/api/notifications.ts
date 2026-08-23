import { apiClient } from "@/lib/api";
import type { Notification, UnreadCountResponse } from "@/types";
import { useAuthStore } from "@/stores/authStore";

const getRolePath = () => {
  const role = useAuthStore.getState().activeRole?.toLowerCase();
  return role === "worker" ? "worker" : "customer";
};

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[] | { data: Notification[] }>(
      `/api/v1/notifications/${getRolePath()}`,
    );
    if (Array.isArray(res)) return res;
    return (res as { data?: Notification[] })?.data ?? [];
  },

  getUnreadCount: (): Promise<UnreadCountResponse> => {
    return apiClient.get<UnreadCountResponse>(
      `/api/v1/notifications/${getRolePath()}/unread-count`,
    );
  },

  markAsRead: (id: string): Promise<{ success: boolean }> => {
    return apiClient.patch<{ success: boolean }>(
      `/api/v1/notifications/${getRolePath()}/${id}/read`,
    );
  },

  markAllAsRead: (): Promise<{ success: boolean }> => {
    return apiClient.patch<{ success: boolean }>(
      `/api/v1/notifications/${getRolePath()}/read-all`,
    );
  },
};
