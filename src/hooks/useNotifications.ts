import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";
import type { Notification, UnreadCountResponse } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export const useNotifications = () => {
  const activeRole = useAuthStore((state) => state.activeRole);
  return useQuery<Notification[], Error>({
    queryKey: ["notifications", activeRole],
    queryFn: () => notificationsApi.getNotifications(),
  });
};

export const useUnreadNotificationCount = () => {
  const activeRole = useAuthStore((state) => state.activeRole);
  return useQuery<UnreadCountResponse, Error>({
    queryKey: ["notifications", "unread-count", activeRole],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const activeRole = useAuthStore((state) => state.activeRole);

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", activeRole],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", activeRole],
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const activeRole = useAuthStore((state) => state.activeRole);

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", activeRole],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", activeRole],
      });
    },
  });
};
