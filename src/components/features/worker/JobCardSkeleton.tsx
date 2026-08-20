import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export interface JobCardSkeletonProps {
  className?: string;
}

export const JobCardSkeleton: React.FC<JobCardSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      data-testid="job-card-skeleton"
      className={`bg-surface border border-border rounded-md p-5 shadow-xs flex flex-col justify-between gap-4 ${className}`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Skeleton width={80} height={20} />
          <Skeleton width={90} height={24} />
        </div>
        <Skeleton width="85%" height={22} />
        <div className="space-y-1.5 pt-1">
          <Skeleton width="100%" height={14} />
          <Skeleton width="60%" height={14} />
        </div>
      </div>

      <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-3">
        <div className="flex gap-4">
          <Skeleton width={80} height={14} />
          <Skeleton width={70} height={14} />
        </div>
        <div className="flex gap-2">
          <Skeleton width={60} height={32} className="rounded-sm" />
          <Skeleton width={70} height={32} className="rounded-sm" />
        </div>
      </div>
    </div>
  );
};
