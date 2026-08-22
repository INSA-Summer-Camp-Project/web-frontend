import { apiClient } from "@/lib/api";

export interface CheckoutPayload {
  jobId: string;
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
    return apiClient.post<CheckoutResponse>("/api/v1/payments/checkout", payload);
  },
};
