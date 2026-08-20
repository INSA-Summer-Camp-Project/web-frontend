import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortfolioSection } from "@/components/features/worker/PortfolioSection";
import { workersApi } from "@/lib/api/workers";
import type { PortfolioItem } from "@/types";

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
  Wrapper.displayName = "TestPortfolioWrapper";
  return Wrapper;
}

describe("PortfolioSection", () => {
  const mockPortfolios: PortfolioItem[] = [
    {
      id: "port-1",
      title: "Hardwood Floor Restoration",
      description: "Sanded and varnished 120sqm oak floors.",
      imageUrl: "https://example.com/floor.jpg",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders portfolio gallery items", () => {
    render(<PortfolioSection portfolios={mockPortfolios} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Hardwood Floor Restoration")).toBeInTheDocument();
    expect(
      screen.getByText("Sanded and varnished 120sqm oak floors."),
    ).toBeInTheDocument();
  });

  it("opens delete confirmation modal and calls deletePortfolio", async () => {
    const deleteSpy = vi
      .spyOn(workersApi, "deletePortfolio")
      .mockResolvedValueOnce({ success: true, message: "Deleted" });

    render(<PortfolioSection portfolios={mockPortfolios} />, {
      wrapper: createWrapper(),
    });

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteBtn);

    expect(screen.getByText("Delete Portfolio Item?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Delete Item" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("port-1");
    });
  });

  it("opens add portfolio modal when Add Project button is clicked", () => {
    render(<PortfolioSection portfolios={mockPortfolios} />, {
      wrapper: createWrapper(),
    });

    const addBtn = screen.getByRole("button", { name: "Add Project" });
    fireEvent.click(addBtn);

    expect(screen.getByText("Add Portfolio Project")).toBeInTheDocument();
  });
});
