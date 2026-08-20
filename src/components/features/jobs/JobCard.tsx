import React from "react";
import Link from "next/link";
import type { Job } from "@/features/jobs/types";
import { Badge } from "@/components/ui";

export const JobCard = ({ job }: { job: Job }) => {
  return (
    <Link
      href={`/customer/jobs/${job.id}`}
      className="block p-6 rounded-sm border border-border bg-surface hover:border-primary/40 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-ink">{job.title}</h3>
          <p className="text-sm text-ink-muted mt-1 line-clamp-2">
            {job.description}
          </p>
        </div>
        <div className="text-right ml-4">
          <span className="font-semibold text-primary block">
            {job.budget} ETB
          </span>
          <Badge
            variant={
              job.status === "OPEN"
                ? "primary"
                : job.status === "IN_PROGRESS"
                  ? "success"
                  : job.status === "COMPLETED"
                    ? "default"
                    : "error"
            }
            className="mt-2"
          >
            {job.status}
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs text-ink-muted border-t border-border pt-4">
        <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
};
