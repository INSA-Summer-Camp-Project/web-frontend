import { apiClient } from "@/lib/api";

export interface CheckoutPayload {
  applicationId: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  txRef: string;
}

export const paymentsApi = {
  /**
   * POST /api/v1/payments/checkout
   * Initializes a Chapa checkout session for a job.
   */
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    return apiClient.post<CheckoutResponse>(
      "/api/v1/payments/checkout",
      payload,
    );
  },

  /**
   * GET /api/v1/payments/verify/:txRef
   * Verifies payment status and returns the authoritative status
   */
  verify: async (txRef: string): Promise<{ status: string }> => {
    return apiClient.get<{ status: string }>(
      `/api/v1/payments/verify/${txRef}`,
    );
  },
};
