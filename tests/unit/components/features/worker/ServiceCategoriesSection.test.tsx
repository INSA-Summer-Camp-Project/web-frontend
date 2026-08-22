import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ServiceCategoriesSection } from "@/components/features/worker/ServiceCategoriesSection";
import { workersApi } from "@/lib/api/workers";
import type { WorkerService } from "@/types";

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
  Wrapper.displayName = "TestServiceCategoriesWrapper";
  return Wrapper;
}

describe("ServiceCategoriesSection", () => {
  const mockServices: WorkerService[] = [
    {
      id: "srv-1",
      categoryId: "cat-1",
      category: { id: "cat-1", name: "Plumbing" },
    },
    {
      id: "srv-2",
      categoryId: "cat-2",
      category: { id: "cat-2", name: "Electrical" },
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders active service category chips", () => {
    render(<ServiceCategoriesSection services={mockServices} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("Electrical")).toBeInTheDocument();
  });

  it("calls removeService when remove button is clicked", async () => {
    const removeSpy = vi
      .spyOn(workersApi, "removeService")
      .mockResolvedValueOnce({ success: true, message: "Removed" });

    render(<ServiceCategoriesSection services={mockServices} />, {
      wrapper: createWrapper(),
    });

    const removeButtons = screen.getAllByRole("button", {
      name: "Remove Plumbing",
    });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(removeSpy).toHaveBeenCalledWith("srv-1");
    });
  });

  it("opens category picker modal when Add Category is clicked", async () => {
    vi.spyOn(workersApi, "getCategories").mockResolvedValueOnce([
      { id: "cat-3", name: "Carpentry", description: "Woodworking" },
    ]);

    render(<ServiceCategoriesSection services={mockServices} />, {
      wrapper: createWrapper(),
    });

    const addBtn = screen.getByRole("button", { name: "Add Category" });
    fireEvent.click(addBtn);

    expect(screen.getByText("Add Service Category")).toBeInTheDocument();
  });
});
