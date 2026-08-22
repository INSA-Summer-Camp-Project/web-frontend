import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications";
import { notificationsApi } from "@/lib/api/notifications";
import { useAuthStore } from "@/stores/authStore";
import type { Notification, UnreadCountResponse } from "@/types";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestNotificationsWrapper";
  return { Wrapper, queryClient };
}

describe("useNotifications hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({ user: null, activeRole: "CUSTOMER" });
  });

  it("useNotifications fetches notifications for active role", async () => {
    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        userId: "u-1",
        type: "NEW_PROPOSAL",
        title: "New proposal",
        message: "Check the proposal",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];
    vi.spyOn(notificationsApi, "getNotifications").mockResolvedValueOnce(
      mockNotifications,
    );

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useNotifications(), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockNotifications);
  });

  it("useUnreadNotificationCount fetches unread count", async () => {
    const mockCount: UnreadCountResponse = { count: 5 };
    vi.spyOn(notificationsApi, "getUnreadCount").mockResolvedValueOnce(
      mockCount,
    );

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useUnreadNotificationCount(), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCount);
  });

  it("useMarkNotificationAsRead invalidates notification queries on success", async () => {
    vi.spyOn(notificationsApi, "markAsRead").mockResolvedValueOnce({
      success: true,
    });

    const { Wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMarkNotificationAsRead(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync("notif-1");
    });

    expect(notificationsApi.markAsRead).toHaveBeenCalledWith("notif-1");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["notifications", "CUSTOMER"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["notifications", "unread-count", "CUSTOMER"],
    });
  });

  it("useMarkAllNotificationsAsRead invalidates notification queries on success", async () => {
    vi.spyOn(notificationsApi, "markAllAsRead").mockResolvedValueOnce({
      success: true,
    });

    const { Wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useMarkAllNotificationsAsRead(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(notificationsApi.markAllAsRead).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["notifications", "CUSTOMER"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["notifications", "unread-count", "CUSTOMER"],
    });
  });
});
