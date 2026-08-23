import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient, axiosInstance, ApiError } from "@/lib/api";

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("get", () => {
    it("returns data on successful response", async () => {
      const mockData = { id: "123", name: "Plumbing" };
      vi.spyOn(axiosInstance, "get").mockResolvedValueOnce({
        status: 200,
        data: { success: true, data: mockData },
      });

      const result = await apiClient.get<typeof mockData>(
        "/api/v1/categories/123",
      );
      expect(result).toEqual(mockData);
    });

    it("throws ApiError on success: false", async () => {
      vi.spyOn(axiosInstance, "get").mockResolvedValueOnce({
        status: 400,
        data: { success: false, error: "Not found" },
      });

      await expect(apiClient.get("/api/v1/invalid")).rejects.toThrow(ApiError);
    });
  });

  describe("post", () => {
    it("returns data on successful post", async () => {
      const mockResult = { id: "job-1", title: "Leaky Sink" };
      vi.spyOn(axiosInstance, "post").mockResolvedValueOnce({
        status: 201,
        data: { success: true, data: mockResult },
      });

      const result = await apiClient.post<typeof mockResult>("/api/v1/jobs", {
        title: "Leaky Sink",
      });
      expect(result).toEqual(mockResult);
    });

    it("throws ApiError on failed post", async () => {
      vi.spyOn(axiosInstance, "post").mockResolvedValueOnce({
        status: 422,
        data: { success: false, error: "Validation error" },
      });

      await expect(
        apiClient.post("/api/v1/jobs", { title: "" }),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("put", () => {
    it("returns data on successful put", async () => {
      const mockResult = { id: "wrk-1", bio: "Experienced Plumber" };
      vi.spyOn(axiosInstance, "put").mockResolvedValueOnce({
        status: 200,
        data: { success: true, data: mockResult },
      });

      const result = await apiClient.put<typeof mockResult>(
        "/api/v1/workers/me",
        {
          bio: "Experienced Plumber",
        },
      );
      expect(result).toEqual(mockResult);
    });

    it("throws ApiError on failed put", async () => {
      vi.spyOn(axiosInstance, "put").mockResolvedValueOnce({
        status: 400,
        data: { success: false, error: "Update failed" },
      });

      await expect(apiClient.put("/api/v1/workers/me", {})).rejects.toThrow(
        ApiError,
      );
    });
  });

  describe("patch", () => {
    it("returns data on successful patch", async () => {
      const mockResult = { id: "job-102", status: "IN_PROGRESS" };
      vi.spyOn(axiosInstance, "patch").mockResolvedValueOnce({
        status: 200,
        data: { success: true, data: mockResult },
      });

      const result = await apiClient.patch<typeof mockResult>(
        "/api/v1/jobs/job-102/direct-respond",
        { action: "ACCEPT" },
      );
      expect(result).toEqual(mockResult);
    });

    it("throws ApiError on failed patch", async () => {
      vi.spyOn(axiosInstance, "patch").mockResolvedValueOnce({
        status: 400,
        data: { success: false, error: "Cannot respond" },
      });

      await expect(
        apiClient.patch("/api/v1/jobs/job-102/direct-respond", {
          action: "ACCEPT",
        }),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("delete", () => {
    it("returns data on successful delete", async () => {
      vi.spyOn(axiosInstance, "delete").mockResolvedValueOnce({
        status: 200,
        data: { success: true, data: { message: "Deleted" } },
      });

      const result = await apiClient.delete<{ message: string }>(
        "/api/v1/applications/app-1",
      );
      expect(result).toEqual({ message: "Deleted" });
    });

    it("throws ApiError on failed delete", async () => {
      vi.spyOn(axiosInstance, "delete").mockResolvedValueOnce({
        status: 404,
        data: { success: false, error: "Not found" },
      });

      await expect(
        apiClient.delete("/api/v1/applications/app-999"),
      ).rejects.toThrow(ApiError);
    });

    it("formats validation field errors into readable error message", async () => {
      vi.spyOn(axiosInstance, "post").mockResolvedValueOnce({
        status: 400,
        data: {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed",
            fields: {
              name: "Name must be at least 2 characters",
              categoryId: "Invalid category ID format",
            },
          },
        },
      });

      try {
        await apiClient.post("/api/v1/workers/me/services", {});
        expect.unreachable();
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ApiError);
        const apiErr = err as ApiError;
        expect(apiErr.message).toContain("Name must be at least 2 characters");
        expect(apiErr.message).toContain("Invalid category ID format");
      }
    });
  });
});
