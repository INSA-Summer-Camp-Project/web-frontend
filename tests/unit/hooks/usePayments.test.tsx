import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCheckout, useVerifyPayment } from "@/hooks/usePayments";
import { paymentsApi } from "@/lib/api/payments";

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
  Wrapper.displayName = "TestPaymentsWrapper";
  return { Wrapper, queryClient };
}

describe("usePayments hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("useCheckout calls paymentsApi.checkout and returns result", async () => {
    const mockRes = {
      checkoutUrl: "https://checkout.chapa.co/pay-123",
      txRef: "sh_tx_789",
    };
    vi.spyOn(paymentsApi, "checkout").mockResolvedValueOnce(mockRes);

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCheckout(), { wrapper: Wrapper });

    let mutationResult;
    await act(async () => {
      mutationResult = await result.current.mutateAsync({
        applicationId: "app-abc",
      });
    });

    expect(paymentsApi.checkout).toHaveBeenCalledWith({
      applicationId: "app-abc",
    });
    expect(mutationResult).toEqual(mockRes);
  });

  it("useVerifyPayment fetches payment status when txRef is provided", async () => {
    const mockRes = { status: "PAID" };
    vi.spyOn(paymentsApi, "verify").mockResolvedValueOnce(mockRes);

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useVerifyPayment("sh_tx_789"), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(paymentsApi.verify).toHaveBeenCalledWith("sh_tx_789");
    expect(result.current.data).toEqual(mockRes);
  });

  it("useVerifyPayment is disabled when txRef is null", async () => {
    const verifySpy = vi.spyOn(paymentsApi, "verify");

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useVerifyPayment(null), {
      wrapper: Wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(verifySpy).not.toHaveBeenCalled();
  });
});
