"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useJobDetail } from "@/hooks/useJobs";
import {
  useMyApplications,
  useApplyJob,
  useWithdrawApplication,
  useDirectRespond,
} from "@/hooks/useApplications";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  JobDetailCard,
  ApplyForm,
  ApplicationStatusBanner,
  DirectRespondPanel,
} from "@/components/features/worker";
import type { ApplyPayload } from "@/types";

export default function WorkerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  // 1. Fetch job details
  const {
    data: job,
    isLoading: isJobLoading,
    isError: isJobError,
    refetch: refetchJob,
  } = useJobDetail(id);

  // 2. Fetch my applications to check if already applied
  const {
    data: myApplications = [],
    isLoading: isAppsLoading,
    refetch: refetchApps,
  } = useMyApplications();

  // 3. Mutations
  const applyMutation = useApplyJob(id);
  const withdrawMutation = useWithdrawApplication(id);
  const directRespondMutation = useDirectRespond(id);

  const existingApplication = myApplications.find((app) => app.jobId === id);

  const handleApply = async (payload: ApplyPayload) => {
    try {
      await applyMutation.mutateAsync(payload);
      toast.success("Proposal submitted successfully!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit proposal.";
      toast.error(errorMessage);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    try {
      await withdrawMutation.mutateAsync(applicationId);
      toast.success("Proposal withdrawn successfully.");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to withdraw proposal.";
      toast.error(errorMessage);
    }
  };

  const handleDirectRespond = async (action: "ACCEPT" | "DECLINE") => {
    try {
      await directRespondMutation.mutateAsync({ action });
      if (action === "ACCEPT") {
        toast.success(
          "Direct booking accepted! You are now assigned to this job.",
        );
      } else {
        toast.success("Direct booking request declined.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to respond to booking request.";
      toast.error(errorMessage);
    }
  };

  const isLoading = isJobLoading || isAppsLoading;

  if (isJobError) {
    return (
      <div className="space-y-6">
        <PageHeader
          backHref="/worker/jobs"
          backLabel="Back to Jobs"
          title="Job Details"
        />
        <ErrorState
          title="Unable to load job details"
          message="We could not find the requested job or there was an error retrieving it."
          onRetry={() => {
            refetchJob();
            refetchApps();
          }}
          retryLabel="Retry"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header with Back Navigation */}
      <PageHeader
        backHref="/worker/jobs"
        backLabel="Back to Job Board"
        title={isLoading ? "Loading Job..." : job?.title || "Job Details"}
      />

      {isLoading ? (
        <div
          data-testid="job-detail-skeleton"
          className="bg-surface border border-border rounded-md p-6 space-y-6 shadow-xs"
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton width={80} height={20} />
              <Skeleton width={90} height={20} />
            </div>
            <Skeleton width="60%" height={32} />
            <Skeleton width={180} height={16} />
          </div>
          <div className="space-y-2 pt-4 border-t border-border">
            <Skeleton width="100%" height={16} />
            <Skeleton width="90%" height={16} />
            <Skeleton width="75%" height={16} />
          </div>
        </div>
      ) : job ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <JobDetailCard job={job} />
          </div>

          {/* Right Column: Dynamic Action Card / Proposal Status */}
          <div className="space-y-6">
            {/* Direct Booking Response Panel */}
            {job.source === "DIRECT" &&
            (job.status === "PENDING" || job.status === "OPEN") &&
            !existingApplication ? (
              <DirectRespondPanel
                jobId={job.id}
                onRespond={handleDirectRespond}
                isLoading={directRespondMutation.isPending}
              />
            ) : existingApplication ? (
              /* Already Applied Banner */
              <ApplicationStatusBanner
                application={existingApplication}
                onWithdraw={handleWithdraw}
                isWithdrawing={withdrawMutation.isPending}
              />
            ) : job.status === "OPEN" ? (
              /* New Application Form */
              <ApplyForm
                jobId={job.id}
                defaultBudget={job.budget}
                onSubmit={handleApply}
                isLoading={applyMutation.isPending}
                onCancel={() => router.push("/worker/jobs")}
              />
            ) : (
              /* Job Closed Card */
              <div className="bg-surface-alt border border-border rounded-md p-6 text-center space-y-2">
                <h3 className="font-serif text-base font-bold text-ink">
                  Job Closed
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  This job is no longer accepting new proposals or has already
                  been assigned.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
