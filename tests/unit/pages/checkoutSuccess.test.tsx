import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CheckoutSuccessPage from "@/app/(dashboard)/customer/checkout/[jobId]/success/page";
import { paymentsApi } from "@/lib/api/payments";

let mockSearchParams = new URLSearchParams("tx_ref=sh_test_123");

vi.mock("next/navigation", () => ({
  useParams: () => ({ jobId: "job-123" }),
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

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
  Wrapper.displayName = "TestCheckoutSuccessWrapper";
  return { Wrapper, queryClient };
}

describe("CheckoutSuccessPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockSearchParams = new URLSearchParams("tx_ref=sh_test_123");
  });

  it("renders verified payment success state when payment is PAID", async () => {
    vi.spyOn(paymentsApi, "verify").mockResolvedValueOnce({ status: "PAID" });

    const { Wrapper } = createWrapper();
    render(<CheckoutSuccessPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Payment Successful!")).toBeInTheDocument();
      expect(
        screen.getByText(/Your payment has been securely escrowed/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Ref: sh_test_123")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "View Job Dashboard" }),
      ).toBeInTheDocument();
    });
  });

  it("renders missing transaction reference when tx_ref is not in search params", async () => {
    mockSearchParams = new URLSearchParams("");

    const { Wrapper } = createWrapper();
    render(<CheckoutSuccessPage />, { wrapper: Wrapper });

    expect(screen.getByText("Invalid Request")).toBeInTheDocument();
    expect(
      screen.getByText("Missing transaction reference."),
    ).toBeInTheDocument();
  });

  it("renders payment failed state when status is FAILED", async () => {
    vi.spyOn(paymentsApi, "verify").mockResolvedValueOnce({ status: "FAILED" });

    const { Wrapper } = createWrapper();
    render(<CheckoutSuccessPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Payment Failed")).toBeInTheDocument();
      expect(
        screen.getByText("There was an issue processing your payment."),
      ).toBeInTheDocument();
    });
  });

  it("renders payment pending state when status is PENDING", async () => {
    vi.spyOn(paymentsApi, "verify").mockResolvedValueOnce({
      status: "PENDING",
    });

    const { Wrapper } = createWrapper();
    render(<CheckoutSuccessPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Payment Pending")).toBeInTheDocument();
      expect(
        screen.getByText("Your payment is still being processed."),
      ).toBeInTheDocument();
    });
  });
});
