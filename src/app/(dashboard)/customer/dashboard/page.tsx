"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, Briefcase } from "lucide-react";
import { useCustomerJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/features/jobs/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { JobCardSkeleton } from "@/components/features/jobs/JobCardSkeleton";

function RecentJobs() {
  const router = useRouter();
  const { data: jobs, isLoading, error, refetch } = useCustomerJobs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <JobCardSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load your jobs. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (!jobs?.length) {
    return (
      <EmptyState
        title="No jobs posted yet"
        description="You haven't posted any service requests. Create your first job to start receiving bids from professionals."
        icon={<Briefcase size={48} className="text-ink-muted/50" />}
        actionLabel="Post a Job"
        onAction={() => router.push("/customer/jobs/new")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            My Dashboard
          </h1>
          <p className="text-ink-muted">
            Manage your service requests and hire top talent.
          </p>
        </div>
        <Link href="/customer/jobs/new">
          <Button leftIcon={<PlusCircle size={18} />}>Post a Job</Button>
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
          <Briefcase className="text-primary" size={24} />
          Recent Jobs
        </h2>

        <RecentJobs />
      </section>
    </div>
  );
}
