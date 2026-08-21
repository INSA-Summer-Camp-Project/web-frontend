"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Briefcase,
  ArrowRight,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useCustomerJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/features/jobs/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { JobCardSkeleton } from "@/components/features/jobs/JobCardSkeleton";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { data: jobs, isLoading, error, refetch } = useCustomerJobs();

  const totalJobs = jobs?.length ?? 0;
  const openJobs = jobs?.filter((j) => j.status === "OPEN").length ?? 0;
  const directRequests = jobs?.filter((j) => j.source === "DIRECT").length ?? 0;
  const completedJobs =
    jobs?.filter((j) => j.status === "COMPLETED").length ?? 0;

  const recentJobs = jobs ? jobs.slice(0, 4) : [];

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            My Dashboard
          </h1>
          <p className="text-ink-muted">
            Manage your service requests, direct bookings, and hire top talent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/customer/jobs">
            <Button variant="outline">View All Jobs</Button>
          </Link>
          <Link href="/customer/jobs/new">
            <Button leftIcon={<PlusCircle size={18} />}>Post a Job</Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-sm p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Posted
            </span>
            <Briefcase size={18} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-ink tabular-nums">
            {totalJobs}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-sm p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Open Requests
            </span>
            <Clock size={18} className="text-warning-text" />
          </div>
          <p className="text-2xl font-bold text-ink tabular-nums">{openJobs}</p>
        </div>

        <div className="bg-surface border border-border rounded-sm p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Direct Bookings
            </span>
            <Send size={18} className="text-info-DEFAULT" />
          </div>
          <p className="text-2xl font-bold text-ink tabular-nums">
            {directRequests}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-sm p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Completed
            </span>
            <CheckCircle2 size={18} className="text-success-text" />
          </div>
          <p className="text-2xl font-bold text-ink tabular-nums">
            {completedJobs}
          </p>
        </div>
      </div>

      {/* Recent Jobs Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <Briefcase className="text-primary" size={22} />
            Recent Jobs
          </h2>
          {totalJobs > 4 && (
            <Link
              href="/customer/jobs"
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              View all ({totalJobs}) <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobCardSkeleton count={4} />
          </div>
        ) : error ? (
          <ErrorState
            message="Failed to load your jobs. Please try again."
            onRetry={refetch}
          />
        ) : !jobs?.length ? (
          <EmptyState
            title="No jobs posted yet"
            description="You haven't posted any service requests. Create your first job to start receiving bids from professionals."
            icon={<Briefcase size={48} className="text-ink-muted/50" />}
            actionLabel="Post a Job"
            onAction={() => router.push("/customer/jobs/new")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
