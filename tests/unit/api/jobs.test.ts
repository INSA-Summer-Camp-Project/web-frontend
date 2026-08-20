import { describe, it, expect, vi, beforeEach } from "vitest";
import { jobsApi } from "@/lib/api/jobs";
import { apiClient } from "@/lib/api";

describe("jobsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getJobs fetches paginated jobs with filters", async () => {
    const mockResponse = {
      data: [{ id: "job-1", title: "Fix leak" }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockResponse);

    const result = await jobsApi.getJobs({ q: "leak" });
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/jobs", {
      params: { q: "leak" },
    });
    expect(result).toEqual(mockResponse);
  });

  it("getMyJobs fetches user's assigned/created jobs", async () => {
    const mockJobs = [{ id: "job-1", title: "Fix leak" }];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockJobs);

    const result = await jobsApi.getMyJobs();
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/jobs/my");
    expect(result).toEqual(mockJobs);
  });

  it("getJobById fetches single job", async () => {
    const mockJob = { id: "job-101", title: "Pipe replacement" };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockJob);

    const result = await jobsApi.getJobById("job-101");
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/jobs/job-101");
    expect(result).toEqual(mockJob);
  });

  it("createJob posts a new job", async () => {
    const mockJob = { id: "job-200", title: "New Job" };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockJob);

    const result = await jobsApi.createJob({
      categoryId: "cat-1",
      title: "New Job",
      description: "Details",
      budget: 100,
    });
    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/jobs", {
      categoryId: "cat-1",
      title: "New Job",
      description: "Details",
      budget: 100,
    });
    expect(result).toEqual(mockJob);
  });

  it("createDirectJob posts direct booking", async () => {
    const mockJob = { id: "job-201", title: "Direct Booking" };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockJob);

    const result = await jobsApi.createDirectJob({
      targetWorkerId: "wrk-1",
      categoryId: "cat-1",
      title: "Direct Booking",
      description: "Details",
      budget: 150,
    });
    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/jobs/direct", {
      targetWorkerId: "wrk-1",
      categoryId: "cat-1",
      title: "Direct Booking",
      description: "Details",
      budget: 150,
    });
    expect(result).toEqual(mockJob);
  });

  it("directRespond sends accept or decline", async () => {
    const mockJob = { id: "job-102", status: "IN_PROGRESS" };
    vi.spyOn(apiClient, "patch").mockResolvedValueOnce(mockJob);

    const result = await jobsApi.directRespond("job-102", { action: "ACCEPT" });
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/v1/jobs/job-102/direct-respond",
      { action: "ACCEPT" },
    );
    expect(result).toEqual(mockJob);
  });

  it("updateStatus sends updated status", async () => {
    const mockJob = { id: "job-102", status: "COMPLETED" };
    vi.spyOn(apiClient, "patch").mockResolvedValueOnce(mockJob);

    const result = await jobsApi.updateStatus("job-102", {
      status: "COMPLETED",
    });
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/v1/jobs/job-102/status",
      { status: "COMPLETED" },
    );
    expect(result).toEqual(mockJob);
  });

  it("getCategories fetches all service categories", async () => {
    const mockCategories = [{ id: "cat-1", name: "Plumbing" }];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCategories);

    const result = await jobsApi.getCategories();
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/categories");
    expect(result).toEqual(mockCategories);
  });
});
