import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJob, useUpdateJobStatus } from "@/hooks/useJobs";
import { useJobApplications } from "@/hooks/useApplications";
import { ArrowLeft, Briefcase, CheckCircle2, Clock, Star } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { RatingStars } from "@/components/ui/RatingStars";
import { ReviewModal } from "@/components/features/reviews";
import { useMyReviews } from "@/hooks/useReviews";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

import {
  JobHeader,
  JobActions,
  WorkerBanner,
  JobProposals,
  EditJobModal,
} from "@/components/features/jobs";

export default function CustomerJobDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: job, isLoading: jobLoading, error: jobError } = useJob(id);
  const {
    data: proposals,
    isLoading: proposalsLoading,
    refetch: refetchProposals,
  } = useJobApplications(id);
  const { data: myReviews, refetch: refetchMyReviews } = useMyReviews();

  const { mutate: updateJobStatus, isPending: isUpdatingStatus } =
    useUpdateJobStatus(id);

  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (jobLoading) {
    return (
      <div className="p-8 text-ink-muted flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Loading job details...</span>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="p-8">
        <ErrorState
          message="Could not load job details. The job may not exist or has been deleted."
          onRetry={() => router.push("/customer/jobs")}
          retryLabel="Back to My Jobs"
        />
      </div>
    );
  }

  const isCompleted = job.status === "COMPLETED";

  // Check if current user already submitted a review for this completed job
  const existingReview = myReviews?.find(
    (r) => r.jobId === id || (r.job && (r.job as { id?: string }).id === id),
  );

  const handleConfirmCancelJob = () => {
    updateJobStatus(
      { status: "CANCELLED" },
      {
        onSuccess: () => {
          toast.success("Job has been cancelled.");
          setCancelModalOpen(false);
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to cancel job.",
          );
        },
      },
    );
  };

  const handleConfirmCompleteJob = () => {
    updateJobStatus(
      { status: "COMPLETED" },
      {
        onSuccess: () => {
          toast.success("Job marked as completed!");
          setCompleteModalOpen(false);
          setReviewModalOpen(true);
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Failed to update job status.",
          );
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Top Navigation */}
      <div>
        <button
          onClick={() => router.push("/customer/jobs")}
          className="flex items-center gap-2 text-sm text-ink-muted hover:text-primary transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </button>

        {/* Job Header & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <JobHeader job={job} />
          <JobActions
            job={job}
            hasReview={!!existingReview}
            onCancelClick={() => setCancelModalOpen(true)}
            onCompleteClick={() => setCompleteModalOpen(true)}
            onEditClick={() => setEditModalOpen(true)}
            onReviewClick={() => setReviewModalOpen(true)}
            onPayClick={
              job.status === "IN_PROGRESS"
                ? () => router.push(`/customer/checkout/${job.id}`)
                : undefined
            }
          />
        </div>
      </div>

      {/* Assigned Worker Banner (if hired / in progress / completed) */}
      <WorkerBanner
        job={job}
        hasReview={!!existingReview}
        onReviewClick={() => setReviewModalOpen(true)}
      />

      {/* Review Prompt Banner (if completed and not yet reviewed) */}
      {isCompleted && !existingReview && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-5 flex items-center justify-between flex-wrap gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Star size={20} className="fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">
                How was your experience with{" "}
                {job.assignedWorker?.user?.name || "your specialist"}?
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Rate and review the completed service to finalize the contract
                and help the community.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Star size={14} />}
            onClick={() => setReviewModalOpen(true)}
          >
            Write a Review
          </Button>
        </div>
      )}

      {/* Submitted Review Section (if already reviewed) */}
      {isCompleted && existingReview && (
        <section className="bg-surface rounded-sm border border-border p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Star size={18} className="fill-amber-500 text-amber-500" />
              <h2 className="text-lg font-bold text-ink font-serif">
                Your Submitted Review
              </h2>
            </div>
            {existingReview.createdAt && (
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Clock size={12} />
                Reviewed on{" "}
                {new Date(existingReview.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <RatingStars
                rating={existingReview.rating}
                size="standard"
                showValue
              />
              <span className="text-xs font-semibold text-ink-muted">
                (
                {existingReview.rating === 5
                  ? "Exceptional Service"
                  : existingReview.rating === 4
                    ? "Very Good"
                    : existingReview.rating === 3
                      ? "Average"
                      : "Needs Improvement"}
                )
              </span>
            </div>

            {existingReview.comment ? (
              <p className="text-sm text-ink-secondary leading-relaxed bg-surface-alt p-4 rounded-sm border border-border italic">
                &ldquo;{existingReview.comment}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-ink-muted italic">
                No written comments were included with this rating.
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-success-text pt-2">
              <CheckCircle2 size={14} />
              <span>
                Contract finalized and feedback logged on specialist profile.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Description Section */}
      <section className="bg-surface p-6 rounded-sm border border-border">
        <h2 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
          <Briefcase size={18} className="text-primary" />
          Job Description
        </h2>
        <p className="text-ink-secondary whitespace-pre-wrap leading-relaxed">
          {job.description || "No description provided for this job."}
        </p>
      </section>

      {/* Proposals Section */}
      <JobProposals
        jobId={id}
        isOpen={job.status === "OPEN"}
        proposals={proposals}
        isLoading={proposalsLoading}
        refetchProposals={refetchProposals}
      />

      {/* Modals */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Job Posting"
        description="Are you sure you want to cancel this job? It will be marked as cancelled and will no longer accept proposals."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setCancelModalOpen(false)}>
            Keep Job
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmCancelJob}
            isLoading={isUpdatingStatus}
          >
            Confirm Cancellation
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Mark Job as Completed"
        description="Confirm that the work for this job has been successfully finished by the assigned worker."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setCompleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmCompleteJob}
            isLoading={isUpdatingStatus}
          >
            Confirm Completion
          </Button>
        </div>
      </Modal>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        jobId={job.id}
        workerName={job.assignedWorker?.user?.name || "the specialist"}
        onSuccess={refetchMyReviews}
      />

      {job && (
        <EditJobModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          job={job}
        />
      )}
    </div>
  );
}
