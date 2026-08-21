import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomerProfilePage from "@/app/(dashboard)/customer/profile/page";
import { useAuthStore } from "@/stores/authStore";
import { reviewsApi } from "@/lib/api/reviews";

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
  Wrapper.displayName = "TestCustomerProfileWrapper";
  return Wrapper;
}

describe("CustomerProfilePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it("renders customer account details, reputation score, and empty state for reviews", async () => {
    useAuthStore.getState().setUser({
      id: "cust-1",
      name: "Tadesse Kebede",
      email: "tadesse@example.com",
      phone: "+251911223344",
      customerProfile: {
        id: "cp-1",
        ratingAvg: 4.8,
        bio: "Looking for skilled home renovation specialists in Addis Ababa.",
      },
    });

    vi.spyOn(reviewsApi, "getCustomerReviews").mockResolvedValueOnce([]);

    render(<CustomerProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Tadesse Kebede")).toBeInTheDocument();
    expect(screen.getByText("tadesse@example.com")).toBeInTheDocument();
    expect(screen.getByText("+251911223344")).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(
      screen.getByText(/Looking for skilled home renovation specialists/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No provider reviews yet")).toBeInTheDocument();
    });
  });

  it("renders reviews received from service providers", async () => {
    useAuthStore.getState().setUser({
      id: "cust-2",
      name: "Helen Haile",
      email: "helen@example.com",
      customerProfile: {
        id: "cp-2",
        ratingAvg: 5.0,
      },
    });

    vi.spyOn(reviewsApi, "getCustomerReviews").mockResolvedValueOnce([
      {
        id: "rev-1",
        jobId: "job-101",
        rating: 5,
        comment: "Great customer! Clear instructions and swift payment.",
        createdAt: new Date().toISOString(),
        worker: {
          id: "wrk-1",
          user: { name: "Abel Electrician" },
        },
        job: {
          id: "job-101",
          title: "Complete House Rewiring",
        },
      },
    ]);

    render(<CustomerProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Helen Haile")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Abel Electrician")).toBeInTheDocument();
      expect(screen.getByText("Complete House Rewiring")).toBeInTheDocument();
      expect(
        screen.getByText(/Great customer! Clear instructions/i),
      ).toBeInTheDocument();
    });
  });
});
