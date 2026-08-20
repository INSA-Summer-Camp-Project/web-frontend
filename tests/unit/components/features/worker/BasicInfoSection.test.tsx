import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BasicInfoSection } from "@/components/features/worker/BasicInfoSection";
import type { WorkerProfile } from "@/types";

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
  Wrapper.displayName = "TestBasicInfoWrapper";
  return Wrapper;
}

describe("BasicInfoSection", () => {
  const mockProfile: WorkerProfile = {
    id: "wrk-1",
    bio: "Experienced electrician with 10 years of commercial work.",
    experience_years: 10,
    payment_rate: 450,
    profile_photo: "https://example.com/photo.jpg",
    user: {
      id: "u-1",
      name: "Solomon Kassa",
      email: "solomon@example.com",
      phone: "+251911223344",
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with initial profile values", () => {
    render(<BasicInfoSection profile={mockProfile} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByLabelText("Years of Experience")).toHaveValue(10);
    expect(screen.getByLabelText("Starting / Hourly Rate (ETB)")).toHaveValue(
      450,
    );
    expect(screen.getByLabelText("Professional Biography")).toHaveValue(
      "Experienced electrician with 10 years of commercial work.",
    );
  });

  it("handles form update submit", async () => {
    const handleUpdate = vi.fn();
    render(<BasicInfoSection profile={mockProfile} onUpdate={handleUpdate} />, {
      wrapper: createWrapper(),
    });

    const bioInput = screen.getByLabelText("Professional Biography");
    fireEvent.change(bioInput, {
      target: { value: "Updated professional bio description." },
    });

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          bio: "Updated professional bio description.",
          experience_years: 10,
          payment_rate: 450,
        }),
      );
    });
  });
});
