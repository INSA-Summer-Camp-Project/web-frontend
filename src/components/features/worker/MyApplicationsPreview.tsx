import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Application } from "@/types";

export interface MyApplicationsPreviewProps {
  applications: Application[];
  isLoading?: boolean;
  viewAllHref?: string;
  className?: string;
}

export const MyApplicationsPreview: React.FC<MyApplicationsPreviewProps> = ({
  applications,
  isLoading = false,
  viewAllHref = "/worker/jobs?tab=my_work",
  className = "",
}) => {
  if (isLoading) {
    return <MyApplicationsPreviewSkeleton className={className} />;
  }

  return (
    <div
      className={`bg-surface border border-border rounded-md shadow-xs overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-accent-light text-accent flex items-center justify-center border border-accent/20">
            <FileText size={16} />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-ink">
              My Applications
            </h2>
            <p className="text-xs text-ink-muted">
              Recent proposals and their status
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
      {applications.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title="No applications submitted yet"
            description="Browse open job postings and submit your bids to get hired."
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {applications.slice(0, 5).map((app) => (
            <div
              key={app.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-alt/40 transition-colors"
            >
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/worker/jobs/${app.jobId}`}
                    className="font-serif text-sm md:text-base font-bold text-ink hover:text-primary transition-colors truncate"
                  >
                    {app.job?.title ||
                      `Job Application #${app.id.substring(0, 8)}`}
                  </Link>
                  <Badge status={app.status} size="sm" dot />
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-muted flex-wrap">
                  {app.estimatedTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>Est. {app.estimatedTime}</span>
                    </span>
                  )}

                  {app.createdAt && (
                    <span>
                      Applied on{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Proposed Bid */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-ink-muted">
                    Your Proposal
                  </span>
                  <PriceDisplay amount={app.proposedPrice} size="md" />
                </div>

                <Link
                  href={`/worker/jobs/${app.jobId}`}
                  className="text-xs font-semibold text-primary hover:text-primary-dark ml-2"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MyApplicationsPreviewSkeleton: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <div
      data-testid="my-applications-skeleton"
      className={`bg-surface border border-border rounded-md shadow-xs overflow-hidden ${className}`}
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton width={32} height={32} className="rounded-sm" />
          <div className="space-y-1.5">
            <Skeleton width={120} height={16} />
            <Skeleton width={160} height={12} />
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
              <Skeleton width="65%" height={16} />
              <div className="flex gap-3">
                <Skeleton width={50} height={12} />
                <Skeleton width={90} height={12} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton width={80} height={20} />
              <Skeleton width={40} height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
