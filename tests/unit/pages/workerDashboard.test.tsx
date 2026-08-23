import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkerDashboardPage from "@/app/(dashboard)/worker/dashboard/page";
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import { useAuthStore } from "@/stores/authStore";
import type {
  Job,
  Application,
  UserProfile,
  PaginatedJobsResponse,
} from "@/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/worker/dashboard",
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
  Wrapper.displayName = "TestDashboardWrapper";
  return Wrapper;
}

describe("WorkerDashboardPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it("renders greeting header, computed stat cards, and activity previews", async () => {
    const mockUser: UserProfile = {
      id: "usr-1",
      email: "abebe@example.com",
      name: "Abebe Mekonnen",
      role: "WORKER",
      lastActiveRole: "WORKER",
    };

    const mockAvailableJobs: PaginatedJobsResponse = {
      data: [
        {
          id: "job-1",
          customerId: "cust-1",
          categoryId: "cat-1",
          title: "Fix Kitchen Pipe Leak",
          budget: 500,
          source: "POSTING",
          status: "OPEN",
          category: { id: "cat-1", name: "Plumbing" },
          _count: { applications: 3 },
          createdAt: "2026-08-20T00:00:00.000Z",
        },
      ],
      meta: { page: 1, limit: 5, total: 1, totalPages: 1 },
    };

    const mockWorkerJobs: Job[] = [
      {
        id: "job-10",
        customerId: "cust-2",
        categoryId: "cat-1",
        title: "Bathroom Renovation",
        budget: 1200,
        source: "POSTING",
        status: "IN_PROGRESS",
        createdAt: "2026-08-20T00:00:00.000Z",
      },
      {
        id: "job-11",
        customerId: "cust-3",
        categoryId: "cat-1",
        title: "Sink Unclogging",
        budget: 450,
        source: "POSTING",
        status: "COMPLETED",
        createdAt: "2026-08-20T00:00:00.000Z",
      },
    ];

    const mockApplications: Application[] = [
      {
        id: "app-1",
        jobId: "job-1",
        workerId: "wrk-1",
        proposedPrice: 480,
        estimatedTime: "2 hours",
        status: "PENDING",
        job: {
          id: "job-2",
          customerId: "cust-1",
          categoryId: "cat-1",
          title: "Emergency Pipe Repair",
          budget: 500,
          source: "POSTING",
          status: "OPEN",
          createdAt: "2026-08-20T00:00:00.000Z",
        },
        createdAt: "2026-08-20T00:00:00.000Z",
      },
    ];

    useAuthStore.getState().setUser(mockUser);
    vi.spyOn(jobsApi, "getJobs").mockResolvedValueOnce(mockAvailableJobs);
    vi.spyOn(jobsApi, "getMyJobs").mockResolvedValueOnce(mockWorkerJobs);
    vi.spyOn(applicationsApi, "getMyApplications").mockResolvedValueOnce(
      mockApplications,
    );

    render(<WorkerDashboardPage />, { wrapper: createWrapper() });

    // Verify greeting
    await waitFor(() => {
      expect(screen.getByText("Hello, Abebe Mekonnen")).toBeInTheDocument();
    });

    // Verify stat cards
    await waitFor(() => {
      expect(screen.getByText("Active Jobs")).toBeInTheDocument();
    });
    expect(screen.getByText("1 in progress")).toBeInTheDocument();
    expect(screen.getByText("Total Earnings")).toBeInTheDocument();
    expect(screen.getByText("450")).toBeInTheDocument(); // completed job budget
    expect(screen.getByText("Completed Jobs")).toBeInTheDocument();
    expect(screen.getByText("1 jobs completed")).toBeInTheDocument();

    // Verify Available Jobs section
    await waitFor(() => {
      expect(screen.getByText("Fix Kitchen Pipe Leak")).toBeInTheDocument();
    });
    expect(screen.getByText("Available Jobs")).toBeInTheDocument();

    // Verify My Applications section
    await waitFor(() => {
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });
    expect(screen.getByText("My Applications")).toBeInTheDocument();
  });
});
