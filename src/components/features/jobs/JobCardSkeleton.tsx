import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface JobCardSkeletonProps {
  count?: number;
}

export function JobCardSkeleton({ count = 1 }: JobCardSkeletonProps) {
  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className="border border-surface-alt rounded-lg p-6 bg-surface shadow-sm space-y-4"
    >
      <div className="flex items-start space-x-4">
        {/* Avatar/Icon Placeholder */}
        <Skeleton variant="circular" className="h-10 w-10 shrink-0" />

        <div className="space-y-2 flex-1">
          {/* Title */}
          <Skeleton variant="text" className="h-5 w-2/3" />

          {/* Category / Location */}
          <div className="flex items-center space-x-2">
            <Skeleton variant="text" className="h-3 w-1/4" />
            <Skeleton variant="circular" className="h-3 w-3" /> {/* dot */}
            <Skeleton variant="text" className="h-3 w-1/3" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 pt-2">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
        <Skeleton variant="text" className="h-4 w-4/6" />
      </div>

      {/* Footer (Budget & Status) */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-alt">
        <Skeleton variant="text" className="h-4 w-1/4" />
        <Skeleton variant="rounded" className="h-8 w-1/4" />{" "}
        {/* Status Badge */}
      </div>
    </div>
  ));

  return count === 1 ? skeletons[0] : <>{skeletons}</>;
}
