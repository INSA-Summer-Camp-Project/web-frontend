import { describe, it, expect, vi, beforeEach } from "vitest";
import { paymentsApi } from "@/lib/api/payments";
import { apiClient } from "@/lib/api";

describe("paymentsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("checkout posts to /api/v1/payments/checkout", async () => {
    const mockResponse = {
      checkoutUrl: "https://checkout.chapa.co/test-checkout",
      txRef: "sh_test_123",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockResponse);

    const result = await paymentsApi.checkout({ applicationId: "app-123" });
    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/payments/checkout", {
      applicationId: "app-123",
    });
    expect(result).toEqual(mockResponse);
  });

  it("verify gets /api/v1/payments/verify/:txRef", async () => {
    const mockResponse = { status: "PAID" };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockResponse);

    const result = await paymentsApi.verify("sh_test_123");
    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/payments/verify/sh_test_123",
    );
    expect(result).toEqual(mockResponse);
  });
});
