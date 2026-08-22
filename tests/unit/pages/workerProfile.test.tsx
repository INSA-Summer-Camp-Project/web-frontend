import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WorkerProfilePage from "@/app/(dashboard)/worker/profile/page";
import { workersApi } from "@/lib/api/workers";
import type { WorkerProfile } from "@/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/worker/profile",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "u-1",
      name: "Tadesse Kebede",
      phone: "+251911223344",
      role: "WORKER",
    },
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
  Wrapper.displayName = "TestWorkerProfileWrapper";
  return Wrapper;
}

describe("WorkerProfilePage", () => {
  const mockProfile: WorkerProfile = {
    id: "wrk-1",
    bio: "Skilled electrician and contractor.",
    experience_years: 8,
    payment_rate: 400,
    profile_photo: "https://example.com/photo.jpg",
    user: {
      id: "u-1",
      name: "Tadesse Kebede",
      email: "tadesse@example.com",
      phone: "+251911223344",
    },
    services: [
      {
        id: "srv-1",
        categoryId: "cat-1",
        category: { id: "cat-1", name: "Electrical" },
      },
    ],
    portfolios: [
      {
        id: "port-1",
        title: "Villa Wiring",
        imageUrl: "https://example.com/villa.jpg",
      },
    ],
    certificates: [
      {
        id: "cert-1",
        title: "Level 4 License",
        fileUrl: "https://example.com/license.pdf",
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders profile summary header, basic info, and sections", async () => {
    vi.spyOn(workersApi, "getMe").mockResolvedValueOnce(mockProfile);
    vi.spyOn(workersApi, "getMyServices").mockResolvedValueOnce(
      mockProfile.services || [],
    );

    render(<WorkerProfilePage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Tadesse Kebede")).toBeInTheDocument();
      expect(screen.getByText(/8 Years Experience/)).toBeInTheDocument();
      expect(screen.getAllByText("Basic Profile Information")).toHaveLength(2);
      expect(screen.getByText("Service Categories")).toBeInTheDocument();
      expect(
        screen.getByText("Work Portfolio & Project Gallery"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Certifications & Accreditations"),
      ).toBeInTheDocument();
    });
  });

  it("handles mobile tab switching", async () => {
    vi.spyOn(workersApi, "getMe").mockResolvedValueOnce(mockProfile);
    vi.spyOn(workersApi, "getMyServices").mockResolvedValueOnce(
      mockProfile.services || [],
    );

    render(<WorkerProfilePage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/8 Years Experience/)).toBeInTheDocument();
    });

    const portfolioTab = screen.getByRole("button", { name: "Portfolio" });
    fireEvent.click(portfolioTab);

    expect(screen.getAllByText("Villa Wiring")).toHaveLength(2);
  });

  it("renders error state when profile query fails", async () => {
    vi.spyOn(workersApi, "getMe").mockRejectedValueOnce(
      new Error("Failed to load profile"),
    );

    render(<WorkerProfilePage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Failed to load profile")).toBeInTheDocument();
    });
  });
});
