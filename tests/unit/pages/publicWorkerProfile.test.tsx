import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PublicWorkerProfilePage from "@/app/worker/[id]/page";
import { workersApi } from "@/lib/api/workers";
import * as useAuthHook from "@/hooks/useAuth";
import type { WorkerProfile, WorkerReputation, Review } from "@/types";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "wrk-123" }),
  useRouter: () => ({
    push: mockPush,
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
  Wrapper.displayName = "TestPublicWorkerProfileWrapper";
  return Wrapper;
}

describe("PublicWorkerProfilePage", () => {
  const mockProfile: WorkerProfile = {
    id: "wrk-123",
    bio: "Certified plumber and contractor with 10 years experience.",
    experience_years: 10,
    payment_rate: 450,
    profile_photo: "https://example.com/photo.jpg",
    user: {
      id: "u-10",
      name: "Alemayehu Tadesse",
      email: "alemayehu@example.com",
      phone: "+251911334455",
    },
    services: [
      {
        id: "srv-1",
        categoryId: "cat-1",
        category: { id: "cat-1", name: "Plumbing" },
      },
    ],
    portfolios: [
      {
        id: "port-1",
        title: "Commercial Pipe Fitting",
        imageUrl: "https://example.com/pipes.jpg",
        description: "Full building copper piping network.",
      },
    ],
    certificates: [
      {
        id: "cert-1",
        title: "Master Plumber License",
        fileUrl: "https://example.com/cert.pdf",
        issuedDate: "2024-01-15T00:00:00.000Z",
      },
    ],
  };

  const mockReputation: WorkerReputation = {
    workerId: "wrk-123",
    rating_avg: 4.9,
    totalReviews: 18,
    distribution: { "5": 16, "4": 2, "3": 0, "2": 0, "1": 0 },
    metrics: {
      completedJobs: 30,
      cancelledJobs: 0,
      jobCompletionRate: 1,
      repeatCustomers: 8,
    },
    badges: ["Top Rated", "Verified Pro"],
  };

  const mockReviews: Review[] = [
    {
      id: "rev-1",
      rating: 5,
      comment: "Fixed bathroom leak quickly and professionally.",
      customer: { id: "c-1", name: "Sara Bekele" },
      job: {
        id: "j-1",
        title: "Pipe Repair",
        category: { id: "cat-1", name: "Plumbing" },
      },
      createdAt: "2026-08-19T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: null,
      activeRole: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });
  });

  it("renders profile details, services, portfolio, and reviews", async () => {
    vi.spyOn(workersApi, "getById").mockResolvedValueOnce(mockProfile);
    vi.spyOn(workersApi, "getReputation").mockResolvedValueOnce(mockReputation);
    vi.spyOn(workersApi, "getReviews").mockResolvedValueOnce(mockReviews);

    render(<PublicWorkerProfilePage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Alemayehu Tadesse")).toBeInTheDocument();
      expect(screen.getByText("Commercial Pipe Fitting")).toBeInTheDocument();
      expect(screen.getByText("Master Plumber License")).toBeInTheDocument();
      expect(screen.getByText("Sara Bekele")).toBeInTheDocument();
      expect(
        screen.getByText("“Fixed bathroom leak quickly and professionally.”"),
      ).toBeInTheDocument();
    });
  });

  it("redirects unauthenticated user to login upon clicking Hire button", async () => {
    vi.spyOn(workersApi, "getById").mockResolvedValueOnce(mockProfile);
    vi.spyOn(workersApi, "getReputation").mockResolvedValueOnce(mockReputation);
    vi.spyOn(workersApi, "getReviews").mockResolvedValueOnce(mockReviews);

    render(<PublicWorkerProfilePage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Alemayehu Tadesse")).toBeInTheDocument();
    });

    const hireBtn = screen.getByRole("button", { name: "Hire Alemayehu" });
    fireEvent.click(hireBtn);

    expect(mockPush).toHaveBeenCalledWith("/login?redirect=/worker/wrk-123");
  });

  it("opens booking modal for authenticated user", async () => {
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: {
        id: "u-2",
        name: "Client Test",
        email: "client@example.com",
        role: "CUSTOMER",
      },
      activeRole: "CUSTOMER",
      isAuthenticated: true,
      logout: vi.fn(),
    });

    vi.spyOn(workersApi, "getById").mockResolvedValueOnce(mockProfile);
    vi.spyOn(workersApi, "getReputation").mockResolvedValueOnce(mockReputation);
    vi.spyOn(workersApi, "getReviews").mockResolvedValueOnce(mockReviews);

    render(<PublicWorkerProfilePage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Alemayehu Tadesse")).toBeInTheDocument();
    });

    const hireBtn = screen.getByRole("button", { name: "Hire Alemayehu" });
    fireEvent.click(hireBtn);

    expect(screen.getByText("Hire Alemayehu Tadesse")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Direct Request" }),
    ).toBeInTheDocument();
  });

  it("renders error state when profile query fails", async () => {
    vi.spyOn(workersApi, "getById").mockRejectedValueOnce(
      new Error("Worker not found"),
    );

    render(<PublicWorkerProfilePage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Worker Profile Not Found")).toBeInTheDocument();
    });
  });
});
