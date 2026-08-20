import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Job } from "@/types";

export interface AvailableJobPreviewProps {
  jobs: Job[];
  isLoading?: boolean;
  viewAllHref?: string;
  className?: string;
}

export const AvailableJobPreview: React.FC<AvailableJobPreviewProps> = ({
  jobs,
  isLoading = false,
  viewAllHref = "/worker/jobs",
  className = "",
}) => {
  if (isLoading) {
    return <AvailableJobPreviewSkeleton className={className} />;
  }

  return (
    <div
      className={`bg-surface border border-border rounded-md shadow-xs overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-primary-light text-primary flex items-center justify-center border border-primary/20">
            <Briefcase size={16} />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-ink">
              Available Jobs
            </h2>
            <p className="text-xs text-ink-muted">
              Recent requests matching your expertise
            </p>
          </div>
        </div>

        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors group"
        >
          <span>View All</span>
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* List content */}
      {jobs.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title="No jobs available right now"
            description="Check back soon for newly posted customer requests in your area."
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-alt/40 transition-colors"
            >
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/worker/jobs/${job.id}`}
                    className="font-serif text-sm md:text-base font-bold text-ink hover:text-primary transition-colors truncate"
                  >
                    {job.title}
                  </Link>
                  {job.category && (
                    <Badge variant="default" size="sm">
                      {job.category.name}
                    </Badge>
                  )}
                  {job.source === "DIRECT" && (
                    <Badge status="DIRECT" size="sm">
                      Direct Request
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-muted flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    <span>
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>

                  {job._count?.applications !== undefined && (
                    <span className="flex items-center gap-1">
                      <Users size={13} />
                      <span>{job._count.applications} proposals</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <PriceDisplay amount={job.budget} size="md" />

                <Link href={`/worker/jobs/${job.id}`}>
                  <Button variant="primary" size="sm">
                    Apply
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AvailableJobPreviewSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      data-testid="available-jobs-skeleton"
      className={`bg-surface border border-border rounded-md shadow-xs overflow-hidden ${className}`}
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton width={32} height={32} className="rounded-sm" />
          <div className="space-y-1.5">
            <Skeleton width={120} height={16} />
            <Skeleton width={180} height={12} />
          </div>
        </div>
        <Skeleton width={60} height={14} />
      </div>

      <div className="divide-y divide-border p-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <Skeleton width="70%" height={16} />
              <div className="flex gap-3">
                <Skeleton width={60} height={12} />
                <Skeleton width={80} height={12} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton width={70} height={20} />
              <Skeleton width={60} height={32} className="rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
