"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useJob, useUpdateJobStatus } from "@/hooks/useJobs";
import {
  useJobApplications,
  useAcceptApplication,
  useRejectApplication,
} from "@/hooks/useApplications";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Tag,
  Users,
  Check,
  X,
  UserCheck,
  Star,
} from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReviewModal } from "@/components/features/reviews";
import type { Application } from "@/types";

export default function CustomerJobDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: job, isLoading: jobLoading, error: jobError } = useJob(id);
  const {
    data: proposals,
    isLoading: proposalsLoading,
    refetch: refetchProposals,
  } = useJobApplications(id);

  const { mutate: acceptApplication, isPending: isAccepting } =
    useAcceptApplication(id);
  const { mutate: rejectApplication, isPending: isRejecting } =
    useRejectApplication(id);
  const { mutate: updateJobStatus, isPending: isUpdatingStatus } =
    useUpdateJobStatus(id);

  // Modal states
  const [selectedProposal, setSelectedProposal] = useState<Application | null>(
    null,
  );
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

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

  const isDirect = job.source === "DIRECT";
  const isOpen = job.status === "OPEN";
  const isInProgress = job.status === "IN_PROGRESS";
  const isCompleted = job.status === "COMPLETED";
  const isCancelled = job.status === "CANCELLED";

  // Handlers
  const handleOpenAccept = (proposal: Application) => {
    setSelectedProposal(proposal);
    setAcceptModalOpen(true);
  };

  const handleConfirmAccept = () => {
    if (!selectedProposal) return;
    acceptApplication(selectedProposal.id, {
      onSuccess: () => {
        toast.success("Proposal accepted! The worker has been assigned.");
        setAcceptModalOpen(false);
        setSelectedProposal(null);
        refetchProposals();
      },
      onError: (err) => {
        toast.error(
          err instanceof Error ? err.message : "Failed to accept proposal.",
        );
      },
    });
  };

  const handleOpenReject = (proposal: Application) => {
    setSelectedProposal(proposal);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedProposal) return;
    rejectApplication(selectedProposal.id, {
      onSuccess: () => {
        toast.success("Proposal has been rejected.");
        setRejectModalOpen(false);
        setSelectedProposal(null);
        refetchProposals();
      },
      onError: (err) => {
        toast.error(
          err instanceof Error ? err.message : "Failed to reject proposal.",
        );
      },
    });
  };

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

        {/* Job Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={isDirect ? "accent" : "default"} size="sm">
                {isDirect ? "Direct Request" : "Marketplace"}
              </Badge>
              {job.category?.name && (
                <Badge variant="default" size="sm" className="text-ink-muted">
                  <Tag size={12} className="mr-1" />
                  {job.category.name}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-serif font-bold text-ink mb-3">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Badge status={job.status}>{job.status.replace(/_/g, " ")}</Badge>
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Clock size={14} /> Posted{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 text-ink-muted">
                <Users size={14} /> {proposals?.length ?? 0}{" "}
                {(proposals?.length ?? 0) === 1 ? "proposal" : "proposals"}
              </span>
            </div>
          </div>

          {/* Budget & Header Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0">
            <div className="bg-surface-alt px-6 py-4 rounded-sm border border-border w-full sm:w-auto text-right">
              <span className="block text-xs text-ink-muted mb-1 font-semibold uppercase tracking-wider">
                Budget
              </span>
              <span className="text-2xl font-bold text-primary tabular-nums">
                {typeof job.budget === "number"
                  ? job.budget.toLocaleString()
                  : job.budget}{" "}
                ETB
              </span>
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {isOpen && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setCancelModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  Cancel Job
                </Button>
              )}

              {isInProgress && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle2 size={16} />}
                    onClick={() => setCompleteModalOpen(true)}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setCancelModalOpen(true)}
                  >
                    Cancel Job
                  </Button>
                </>
              )}

              {isCompleted && (
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="lg" dot>
                    Job Completed
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={
                      <Star
                        size={14}
                        className="fill-amber-500 text-amber-500"
                      />
                    }
                    onClick={() => setReviewModalOpen(true)}
                  >
                    Leave Review
                  </Button>
                </div>
              )}

              {isCancelled && (
                <Badge variant="error" size="lg" dot>
                  Job Cancelled
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Worker Banner (if hired / in progress / completed) */}
      {job.assignedWorker && (
        <div className="bg-success-light/30 border border-success/30 rounded-sm p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success-text">
              <UserCheck size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-success-text block">
                Assigned Professional
              </span>
              <span className="font-bold text-ink text-base">
                {job.assignedWorker.user?.name || "Professional Hired"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Star size={14} />}
                onClick={() => setReviewModalOpen(true)}
              >
                Review Specialist
              </Button>
            )}
            {job.assignedWorker.id && (
              <Link href={`/worker/${job.assignedWorker.id}`}>
                <Button variant="outline" size="sm">
                  View Worker Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
            <Users className="text-primary" size={22} />
            Worker Proposals {proposals ? `(${proposals.length})` : ""}
          </h2>
        </div>

        {proposalsLoading ? (
          <div className="p-8 text-center bg-surface border border-border rounded-sm text-ink-muted">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading submitted proposals...
          </div>
        ) : !proposals?.length ? (
          <EmptyState
            title="No proposals submitted yet"
            description={
              isOpen
                ? "Your job is live on the marketplace. Verified professionals will submit their bids and estimated timelines shortly."
                : "No proposals were submitted for this job."
            }
            icon={<Briefcase size={48} className="text-ink-muted/50" />}
          />
        ) : (
          <div className="grid gap-4">
            {proposals.map((proposal) => {
              const isProposalAccepted = proposal.status === "ACCEPTED";
              const isProposalRejected = proposal.status === "REJECTED";
              const isProposalWithdrawn = proposal.status === "WITHDRAWN";
              const isPending = proposal.status === "PENDING";

              return (
                <div
                  key={proposal.id}
                  className={`bg-surface p-6 rounded-sm border transition-all ${
                    isProposalAccepted
                      ? "border-success bg-success-light/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Worker Info */}
                    <div className="flex gap-4">
                      <Avatar
                        src={
                          proposal.worker?.user?.photoUrl ||
                          proposal.worker?.user?.avatarUrl ||
                          undefined
                        }
                        name={proposal.worker?.user?.name || "Worker"}
                        size="lg"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-ink text-lg">
                            {proposal.worker?.user?.name ?? "Worker"}
                          </h3>
                          {proposal.worker?.ratingAvg && (
                            <span className="text-xs bg-amber-500/10 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                              ★ {Number(proposal.worker.ratingAvg).toFixed(1)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-sm text-ink-muted flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{proposal.estimatedTime}</span>
                          </span>
                          {proposal.worker?.id && (
                            <Link
                              href={`/worker/${proposal.worker.id}`}
                              className="text-primary hover:underline text-xs font-semibold"
                            >
                              View Profile
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Proposal Price & Actions */}
                    <div className="flex flex-col md:items-end gap-3 shrink-0">
                      <span className="text-2xl font-bold text-ink tabular-nums">
                        {typeof proposal.proposedPrice === "number"
                          ? proposal.proposedPrice.toLocaleString()
                          : proposal.proposedPrice}{" "}
                        ETB
                      </span>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {isOpen && isPending && (
                          <>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOpenReject(proposal)}
                              leftIcon={<X size={14} />}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleOpenAccept(proposal)}
                              leftIcon={<Check size={14} />}
                            >
                              Accept Bid
                            </Button>
                          </>
                        )}

                        {isProposalAccepted && (
                          <Badge
                            variant="success"
                            leftIcon={<CheckCircle2 size={14} />}
                          >
                            Accepted Bid
                          </Badge>
                        )}

                        {isProposalRejected && (
                          <Badge
                            variant="error"
                            leftIcon={<XCircle size={14} />}
                          >
                            Rejected
                          </Badge>
                        )}

                        {isProposalWithdrawn && (
                          <Badge variant="default">Withdrawn</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Accept Proposal Modal */}
      <Modal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="Accept Proposal & Hire Worker"
        description="Are you sure you want to accept this proposal? The job will be assigned to this professional."
      >
        {selectedProposal && (
          <div className="my-4 p-4 bg-surface-alt rounded-sm border border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Worker:</span>
              <span className="font-semibold text-ink">
                {selectedProposal.worker?.user?.name || "Professional"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Agreed Price:</span>
              <span className="font-bold text-primary">
                {typeof selectedProposal.proposedPrice === "number"
                  ? selectedProposal.proposedPrice.toLocaleString()
                  : selectedProposal.proposedPrice}{" "}
                ETB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Estimated Delivery:</span>
              <span className="font-semibold text-ink">
                {selectedProposal.estimatedTime}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setAcceptModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmAccept}
            isLoading={isAccepting}
          >
            Confirm & Hire
          </Button>
        </div>
      </Modal>

      {/* Reject Proposal Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Proposal"
        description="Are you sure you want to decline this proposal? The worker will be notified."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmReject}
            isLoading={isRejecting}
          >
            Reject Proposal
          </Button>
        </div>
      </Modal>

      {/* Cancel Job Modal */}
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

      {/* Complete Job Modal */}
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

      {/* Review Specialist Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        jobId={job.id}
        workerName={job.assignedWorker?.user?.name || "the specialist"}
      />
    </div>
  );
}
