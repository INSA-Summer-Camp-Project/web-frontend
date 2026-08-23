"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Wallet,
  Search,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useJobs, useWorkerJobs } from "@/hooks/useJobs";
import { useMyApplications } from "@/hooks/useApplications";
import { useAuthStore } from "@/stores/authStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  WorkerStatCard,
  WorkerStatCardSkeleton,
  AvailableJobPreview,
  MyApplicationsPreview,
} from "@/components/features/worker";

export default function WorkerDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);

  // 1. User is loaded by the global AuthProvider into the store
  const isUserLoading = !storeUser;

  // 2. Fetch available jobs preview
  const {
    data: availableJobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
    refetch: refetchJobs,
  } = useJobs({ limit: 5 });

  // 3. Fetch worker's active/completed jobs
  const {
    data: workerJobs,
    isLoading: isWorkerJobsLoading,
    isError: isWorkerJobsError,
    refetch: refetchWorkerJobs,
  } = useWorkerJobs();

  // 4. Fetch worker's submitted applications
  const {
    data: myApplications,
    isLoading: isAppsLoading,
    isError: isAppsError,
    refetch: refetchApps,
  } = useMyApplications();

  // Compute metrics client-side
  const activeJobsCount = (workerJobs || []).filter(
    (job) => job.status === "IN_PROGRESS" || job.status === "PENDING",
  ).length;

  const completedJobsCount = (workerJobs || []).filter(
    (job) => job.status === "COMPLETED",
  ).length;

  const totalEarnings = (workerJobs || [])
    .filter((job) => job.status === "COMPLETED")
    .reduce((sum, job) => {
      const paidSum = job.payments?.reduce(
        (pSum: number, p: { amount?: number | string; status?: string }) => {
          if (p.status && p.status !== "PAID") return pSum;
          const amt =
            typeof p.amount === "number"
              ? p.amount
              : Number.parseFloat(String(p.amount || "0"));
          return pSum + (Number.isNaN(amt) ? 0 : amt);
        },
        0,
      );

      if (paidSum !== undefined && paidSum > 0) {
        return sum + paidSum;
      }

      const budgetNum =
        typeof job.budget === "number"
          ? job.budget
          : Number.parseFloat(String(job.budget || "0"));
      return sum + (Number.isNaN(budgetNum) ? 0 : budgetNum);
    }, 0);

  const displayName = storeUser?.name || storeUser?.fullName || "Professional";

  const hasAnyError = isJobsError || isWorkerJobsError || isAppsError;

  const handleRefetchAll = () => {
    refetchJobs();
    refetchWorkerJobs();
    refetchApps();
  };

  return (
    <div className="space-y-6">
      {/* Header with Greeting & Quick Action */}
      <PageHeader
        title={isUserLoading ? "Welcome back" : `Hello, ${displayName}`}
        subtitle="Here is an overview of your active tasks, earnings, and open opportunities."
        actions={
          <Link href="/worker/jobs">
            <Button variant="primary" size="md" leftIcon={<Search size={16} />}>
              Browse Jobs
            </Button>
          </Link>
        }
      />

      {/* Global Error Notice if any query fails */}
      {hasAnyError && (
        <div
          role="alert"
          className="p-4 rounded-md bg-error-light/50 border border-error/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm"
        >
          <div className="flex items-center gap-2 text-error-text font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span>Some dashboard information could not be loaded.</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefetchAll}
            leftIcon={<RotateCcw size={14} />}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Widgets Grid (3 Cards) */}
      <section aria-label="Worker Statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {isWorkerJobsLoading ? (
            <>
              <WorkerStatCardSkeleton />
              <WorkerStatCardSkeleton />
              <WorkerStatCardSkeleton />
            </>
          ) : (
            <>
              <WorkerStatCard
                label="Active Jobs"
                value={activeJobsCount}
                icon={<Briefcase size={20} />}
                variant="primary"
                change={
                  activeJobsCount > 0
                    ? `${activeJobsCount} in progress`
                    : "No jobs in progress"
                }
                changeType={activeJobsCount > 0 ? "positive" : "neutral"}
              />

              <WorkerStatCard
                label="Total Earnings"
                value={totalEarnings}
                isCurrency={true}
                icon={<Wallet size={20} />}
                variant="accent"
                change="From completed jobs"
                changeType="neutral"
              />

              <WorkerStatCard
                label="Completed Jobs"
                value={completedJobsCount}
                icon={<CheckCircle2 size={20} />}
                variant="success"
                change={
                  completedJobsCount > 0
                    ? `${completedJobsCount} jobs completed`
                    : "Complete jobs to build trust"
                }
                changeType={completedJobsCount > 0 ? "positive" : "neutral"}
              />
            </>
          )}
        </div>
      </section>

      {/* Previews Grid: Available Jobs & My Applications */}
      <section aria-label="Dashboard Activity">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AvailableJobPreview
            jobs={availableJobsData?.data || []}
            isLoading={isJobsLoading}
          />

          <MyApplicationsPreview
            applications={myApplications || []}
            isLoading={isAppsLoading}
          />
        </div>
      </section>
    </div>
  );
}
