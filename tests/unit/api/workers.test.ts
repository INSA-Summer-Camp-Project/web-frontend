import { describe, it, expect, vi, beforeEach } from "vitest";
import { workersApi } from "@/lib/api/workers";
import { apiClient } from "@/lib/api";

describe("workersApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getMe fetches worker profile", async () => {
    const mockProfile = { id: "wrk-1", bio: "Master Plumber" };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockProfile);

    const result = await workersApi.getMe();
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/workers/me");
    expect(result).toEqual(mockProfile);
  });

  it("updateMe updates worker profile", async () => {
    const mockProfile = { id: "wrk-1", payment_rate: 40 };
    vi.spyOn(apiClient, "put").mockResolvedValueOnce(mockProfile);

    const result = await workersApi.updateMe({ payment_rate: 40 });
    expect(apiClient.put).toHaveBeenCalledWith("/api/v1/workers/me", {
      payment_rate: 40,
    });
    expect(result).toEqual(mockProfile);
  });

  it("getById fetches public worker profile", async () => {
    const mockProfile = { id: "wrk-789", bio: "Electrician" };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockProfile);

    const result = await workersApi.getById("wrk-789");
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/workers/wrk-789");
    expect(result).toEqual(mockProfile);
  });

  it("getMyServices fetches worker services", async () => {
    const mockServices = [
      {
        id: "srv-1",
        categoryId: "cat-1",
        category: { id: "cat-1", name: "Plumbing" },
      },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockServices);

    const result = await workersApi.getMyServices();
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/workers/me/services");
    expect(result).toEqual(mockServices);
  });

  it("addService adds a service tag", async () => {
    const mockService = {
      id: "srv-2",
      categoryId: "cat-2",
      category: { id: "cat-2", name: "Cleaning" },
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockService);

    const result = await workersApi.addService({ categoryId: "cat-2" });
    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/workers/me/services", {
      categoryId: "cat-2",
    });
    expect(result).toEqual(mockService);
  });

  it("removeService deletes a service tag", async () => {
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce({
      success: true,
      message: "Deleted",
    });

    const result = await workersApi.removeService("cat-1");
    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/v1/workers/me/services/cat-1",
    );
    expect(result.success).toBe(true);
  });

  it("addPortfolio posts a portfolio item", async () => {
    const mockPortfolio = { id: "port-1", title: "Copper Pipe Install" };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockPortfolio);

    const result = await workersApi.addPortfolio({
      title: "Copper Pipe Install",
      imageUrl: "https://example.com/img.jpg",
    });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/v1/workers/me/portfolios",
      {
        title: "Copper Pipe Install",
        imageUrl: "https://example.com/img.jpg",
      },
    );
    expect(result).toEqual(mockPortfolio);
  });

  it("deletePortfolio deletes a portfolio item", async () => {
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce({
      success: true,
      message: "Deleted",
    });

    const result = await workersApi.deletePortfolio("port-1");
    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/v1/workers/me/portfolios/port-1",
    );
    expect(result.success).toBe(true);
  });

  it("addCertificate posts a certificate item", async () => {
    const mockCert = { id: "cert-1", title: "Master License" };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockCert);

    const result = await workersApi.addCertificate({
      title: "Master License",
      fileUrl: "https://example.com/cert.pdf",
    });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/v1/workers/me/certificates",
      {
        title: "Master License",
        fileUrl: "https://example.com/cert.pdf",
      },
    );
    expect(result).toEqual(mockCert);
  });

  it("deleteCertificate deletes a certificate item", async () => {
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce({
      success: true,
      message: "Deleted",
    });

    const result = await workersApi.deleteCertificate("cert-1");
    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/v1/workers/me/certificates/cert-1",
    );
    expect(result.success).toBe(true);
  });

  it("getReputation fetches reputation data", async () => {
    const mockReputation = {
      workerId: "wrk-1",
      rating_avg: 4.9,
      totalReviews: 24,
      distribution: { "5": 20 },
      metrics: {
        completedJobs: 25,
        cancelledJobs: 0,
        jobCompletionRate: 100,
        repeatCustomers: 4,
      },
      badges: ["TOP_RATED"],
    };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockReputation);

    const result = await workersApi.getReputation("wrk-1");
    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/workers/wrk-1/reputation",
    );
    expect(result).toEqual(mockReputation);
  });

  it("getCategories fetches categories catalog", async () => {
    const mockCategories = [{ id: "cat-1", name: "Plumbing" }];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCategories);

    const result = await workersApi.getCategories();
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/categories");
    expect(result).toEqual(mockCategories);
  });

  it("searchWorkers fetches workers with query parameters", async () => {
    const mockWorkers = [{ id: "wrk-1", bio: "Expert Electrician" }];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockWorkers);

    const result = await workersApi.searchWorkers({
      search: "Electrician",
      minRating: 4,
    });
    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/search/providers", {
      params: { search: "Electrician", minRating: 4 },
    });
    expect(result).toEqual(mockWorkers);
  });
});
