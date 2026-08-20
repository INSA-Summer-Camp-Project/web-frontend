"use client";

import React from "react";
import Link from "next/link";
import { useAvailableJobs } from "@/features/jobs/hooks";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search } from "lucide-react";
import { JobCardSkeleton } from "@/components/features/jobs/JobCardSkeleton";

export default function WorkerJobsBoardPage() {
  const { data: jobs, isLoading, error, refetch } = useAvailableJobs();

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-ink mb-2">
          Available Jobs
        </h1>
        <p className="text-ink-muted">
          Browse open requests from customers and submit your proposals.
        </p>
      </div>

      {/* Main Content */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCardSkeleton count={6} />
          </div>
        ) : error ? (
          <ErrorState
            message="Failed to load available jobs. Please try again."
            onRetry={refetch}
          />
        ) : !jobs?.length ? (
          <EmptyState
            title="No jobs available"
            description="There are currently no open jobs matching your expertise. Check back later!"
            icon={<Search size={48} className="text-ink-muted/50" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/worker/jobs/${job.id}`}
                className="flex flex-col p-6 rounded-sm border border-border bg-surface hover:border-primary/40 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-ink line-clamp-1">
                    {job.title}
                  </h3>
                  <Badge variant="success" className="shrink-0">
                    {job.status}
                  </Badge>
                </div>

                <p className="text-sm text-ink-secondary mb-6 line-clamp-3 flex-1">
                  {job.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-ink-muted uppercase font-semibold">
                      Budget
                    </span>
                    <span className="font-bold text-primary tabular-nums">
                      {job.budget} ETB
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
