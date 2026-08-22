"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJob } from "@/hooks/useJobs";
import { useCreateReview } from "@/hooks/useReviews";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { RatingStars } from "@/components/ui/RatingStars";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "@/components/ui/Toast";

export default function LeaveReviewPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: job, isLoading, isError, refetch } = useJob(jobId);
  const { mutate: createReview, isPending } = useCreateReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <Skeleton className="h-16 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <ErrorState title="Failed to load job" onRetry={() => refetch()} />
      </div>
    );
  }

  // Find the hired worker
  const acceptedApp = job.applications?.find((a) => a.status === "ACCEPTED");
  const worker = acceptedApp?.worker;

  if (!worker) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <ErrorState
          title="Invalid Action"
          message="There is no worker assigned to this job to review."
          retryLabel="Go Back"
          onRetry={() => router.back()}
        />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    createReview(
      {
        jobId: job.id,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          toast.success("Review submitted successfully!");
          router.push(`/customer/jobs/${job.id}`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to submit review");
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <PageHeader
        title="Rate Your Experience"
        subtitle="Your feedback helps maintain trust and quality in our community."
      />

      <div className="bg-surface border border-border rounded-md shadow-xs p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <Avatar
            src={worker.user?.photoUrl || worker.user?.avatarUrl}
            name={worker.user?.name || "Professional"}
            size="lg"
          />
          <div>
            <h3 className="font-bold text-ink">
              {worker.user?.name || "Professional"}
            </h3>
            <p className="text-sm text-ink-muted">
              For job: <span className="italic">{job.title}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <span className="block text-sm font-semibold text-ink">
              How would you rate the service?{" "}
              <span className="text-error">*</span>
            </span>
            <div className="flex justify-center py-4 bg-surface-alt rounded-md">
              <RatingStars
                rating={rating}
                interactive
                onChange={setRating}
                size="lg"
              />
            </div>
            {rating === 0 && (
              <p className="text-xs text-ink-muted mt-1">Tap a star to rate</p>
            )}
          </div>

          <div className="space-y-3">
            <label
              htmlFor="comment"
              className="block text-sm font-semibold text-ink"
            >
              Leave a public review (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="What did you like? What could be improved? Be honest and respectful."
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isPending}>
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
