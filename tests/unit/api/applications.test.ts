import { describe, it, expect, vi, beforeEach } from "vitest";
import { applicationsApi } from "@/lib/api/applications";
import { apiClient } from "@/lib/api";

describe("applicationsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getMyApplications fetches worker applications", async () => {
    const mockApps = [
      { id: "app-1", proposedPrice: 100, estimatedTime: "2 hours" },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockApps);

    const result = await applicationsApi.getMyApplications();
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/applications/me");
    expect(result).toEqual(mockApps);
  });

  it("applyJob submits a proposal", async () => {
    const mockApp = {
      id: "app-1",
      jobId: "job-100",
      proposedPrice: 80,
      estimatedTime: "1 hour",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockApp);

    const result = await applicationsApi.applyJob("job-100", {
      proposedPrice: 80,
      estimatedTime: "1 hour",
    });
    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/jobs/job-100/apply", {
      proposedPrice: 80,
      estimatedTime: "1 hour",
    });
    expect(result).toEqual(mockApp);
  });

  it("withdrawApplication deletes application", async () => {
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce({
      success: true,
      message: "Withdrawn",
    });

    const result = await applicationsApi.withdrawApplication("app-1");
    expect(apiClient.delete).toHaveBeenCalledWith("/api/v1/applications/app-1");
    expect(result.success).toBe(true);
  });

  it("getJobApplications fetches job applications for owner", async () => {
    const mockApps = [
      { id: "app-1", proposedPrice: 100, estimatedTime: "2 hours" },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockApps);

    const result = await applicationsApi.getJobApplications("job-100");
    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/jobs/job-100/applications",
    );
    expect(result).toEqual(mockApps);
  });

  it("acceptApplication hires the worker", async () => {
    const mockResponse = {
      message: "Worker hired",
      jobId: "job-100",
      assignedWorkerId: "wrk-1",
      agreedBudget: 80,
      status: "IN_PROGRESS",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockResponse);

    const result = await applicationsApi.acceptApplication("app-1");
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/v1/applications/app-1/accept",
    );
    expect(result).toEqual(mockResponse);
  });

  it("rejectApplication rejects proposal", async () => {
    const mockApp = { id: "app-1", status: "REJECTED" };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockApp);

    const result = await applicationsApi.rejectApplication("app-1");
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/v1/applications/app-1/reject",
    );
    expect(result).toEqual(mockApp);
  });
});
