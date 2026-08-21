import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReviewModal } from "@/components/features/reviews/ReviewModal";
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
  Wrapper.displayName = "TestReviewModalWrapper";
  return Wrapper;
}

describe("ReviewModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders review modal with 5 stars selected by default", () => {
    render(
      <ReviewModal
        isOpen={true}
        onClose={vi.fn()}
        jobId="job-123"
        workerName="Abel Tesfaye"
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText("Review Abel Tesfaye")).toBeInTheDocument();
    expect(screen.getByText("Exceptional Service")).toBeInTheDocument();
    expect(screen.getByLabelText(/Feedback & Comments/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit Review" }),
    ).toBeInTheDocument();
  });

  it("submits review with rating and comment", async () => {
    vi.spyOn(reviewsApi, "createReview").mockResolvedValueOnce({
      id: "rev-1",
      jobId: "job-123",
      rating: 4,
      comment: "Very prompt and professional work!",
    });

    const onCloseMock = vi.fn();
    const onSuccessMock = vi.fn();

    render(
      <ReviewModal
        isOpen={true}
        onClose={onCloseMock}
        jobId="job-123"
        workerName="Abel Tesfaye"
        onSuccess={onSuccessMock}
      />,
      { wrapper: createWrapper() },
    );

    // Click 4 stars
    fireEvent.click(screen.getByLabelText("Rate 4 stars"));

    // Type comment
    fireEvent.change(screen.getByLabelText(/Feedback & Comments/i), {
      target: { value: "Very prompt and professional work!" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: "Submit Review" }));

    await waitFor(() => {
      expect(reviewsApi.createReview).toHaveBeenCalledWith({
        jobId: "job-123",
        rating: 4,
        comment: "Very prompt and professional work!",
      });
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
