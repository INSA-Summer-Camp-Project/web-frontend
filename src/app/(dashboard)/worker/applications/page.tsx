"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useMyApplications } from "@/hooks/useApplications";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Clock, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function WorkerApplicationsPage() {
  const { data: applications, isLoading, isError, refetch } = useMyApplications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track the status of jobs you've applied for or received direct bookings for."
      />

      <div className="bg-surface border border-border rounded-md shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-sm">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-6 w-24 ml-auto" />
                  <Skeleton className="h-8 w-24 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6">
            <ErrorState
              title="Could not load applications"
              message="There was a problem fetching your applications. Please try again."
              onRetry={() => refetch()}
            />
          </div>
        ) : !applications?.length ? (
          <div className="p-12">
            <EmptyState
              icon={<FileText size={48} className="text-ink-muted/30" />}
              title="No applications yet"
              description="You haven't applied to any jobs. Browse the job board to find work."
              actionButton={
                <Link href="/worker/jobs">
                  <Button variant="primary">Browse Jobs</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {applications.map((app) => (
              <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-alt/50 transition-colors">
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      href={`/worker/jobs/${app.jobId}`}
                      className="font-serif text-lg font-bold text-ink hover:text-primary transition-colors truncate"
                    >
                      {app.job?.title || `Job Application #${app.id.substring(0, 8)}`}
                    </Link>
                    <Badge status={app.status} size="sm" dot />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-ink-muted flex-wrap mt-2">
                    {app.estimatedTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Est. {app.estimatedTime}</span>
                      </span>
                    )}

                    {app.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          Applied on{" "}
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60 w-full sm:w-auto">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs text-ink-muted font-medium mb-1">
                      Your Proposed Price
                    </span>
                    <PriceDisplay amount={app.proposedPrice} size="lg" />
                  </div>

                  <Link href={`/worker/jobs/${app.jobId}`}>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-surface">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
