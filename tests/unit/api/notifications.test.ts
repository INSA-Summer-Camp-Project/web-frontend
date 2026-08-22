import { describe, it, expect, vi, beforeEach } from "vitest";
import { notificationsApi } from "@/lib/api/notifications";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import type { Notification } from "@/types";

describe("notificationsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({ user: null, activeRole: null });
  });

  describe("getNotifications", () => {
    it("targets /api/v1/notifications/customer when activeRole is CUSTOMER", async () => {
      useAuthStore.setState({ activeRole: "CUSTOMER" });
      const mockNotifications: Notification[] = [
        {
          id: "notif-1",
          userId: "u-1",
          type: "NEW_PROPOSAL",
          title: "New proposal received",
          message: "A worker proposed on your job",
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ];
      vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockNotifications);

      const result = await notificationsApi.getNotifications();
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/notifications/customer");
      expect(result).toEqual(mockNotifications);
    });

    it("targets /api/v1/notifications/worker when activeRole is WORKER", async () => {
      useAuthStore.setState({ activeRole: "WORKER" });
      const mockNotifications: Notification[] = [
        {
          id: "notif-2",
          userId: "u-2",
          type: "PROPOSAL_ACCEPTED",
          title: "Proposal accepted",
          message: "Your proposal was accepted",
          isRead: true,
          createdAt: new Date().toISOString(),
        },
      ];
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: mockNotifications });

      const result = await notificationsApi.getNotifications();
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/notifications/worker");
      expect(result).toEqual(mockNotifications);
    });

    it("defaults to customer scope when activeRole is not set", async () => {
      useAuthStore.setState({ activeRole: null });
      vi.spyOn(apiClient, "get").mockResolvedValueOnce([]);

      const result = await notificationsApi.getNotifications();
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/notifications/customer");
      expect(result).toEqual([]);
    });
  });

  describe("getUnreadCount", () => {
    it("targets /api/v1/notifications/customer/unread-count for customer role", async () => {
      useAuthStore.setState({ activeRole: "CUSTOMER" });
      const mockCount = { count: 3 };
      vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCount);

      const result = await notificationsApi.getUnreadCount();
      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/v1/notifications/customer/unread-count",
      );
      expect(result).toEqual(mockCount);
    });

    it("targets /api/v1/notifications/worker/unread-count for worker role", async () => {
      useAuthStore.setState({ activeRole: "WORKER" });
      const mockCount = { count: 1 };
      vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCount);

      const result = await notificationsApi.getUnreadCount();
      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/v1/notifications/worker/unread-count",
      );
      expect(result).toEqual(mockCount);
    });
  });

  describe("markAsRead", () => {
    it("patches /api/v1/notifications/customer/:id/read for customer role", async () => {
      useAuthStore.setState({ activeRole: "CUSTOMER" });
      const mockRes = { success: true };
      vi.spyOn(apiClient, "patch").mockResolvedValueOnce(mockRes);

      const result = await notificationsApi.markAsRead("notif-123");
      expect(apiClient.patch).toHaveBeenCalledWith(
        "/api/v1/notifications/customer/notif-123/read",
      );
      expect(result).toEqual(mockRes);
    });

    it("patches /api/v1/notifications/worker/:id/read for worker role", async () => {
      useAuthStore.setState({ activeRole: "WORKER" });
      const mockRes = { success: true };
      vi.spyOn(apiClient, "patch").mockResolvedValueOnce(mockRes);

      const result = await notificationsApi.markAsRead("notif-456");
      expect(apiClient.patch).toHaveBeenCalledWith(
        "/api/v1/notifications/worker/notif-456/read",
      );
      expect(result).toEqual(mockRes);
    });
  });

  describe("markAllAsRead", () => {
    it("patches /api/v1/notifications/customer/read-all for customer role", async () => {
      useAuthStore.setState({ activeRole: "CUSTOMER" });
      const mockRes = { success: true };
      vi.spyOn(apiClient, "patch").mockResolvedValueOnce(mockRes);

      const result = await notificationsApi.markAllAsRead();
      expect(apiClient.patch).toHaveBeenCalledWith(
        "/api/v1/notifications/customer/read-all",
      );
      expect(result).toEqual(mockRes);
    });

    it("patches /api/v1/notifications/worker/read-all for worker role", async () => {
      useAuthStore.setState({ activeRole: "WORKER" });
      const mockRes = { success: true };
      vi.spyOn(apiClient, "patch").mockResolvedValueOnce(mockRes);

      const result = await notificationsApi.markAllAsRead();
      expect(apiClient.patch).toHaveBeenCalledWith(
        "/api/v1/notifications/worker/read-all",
      );
      expect(result).toEqual(mockRes);
    });
  });
});
