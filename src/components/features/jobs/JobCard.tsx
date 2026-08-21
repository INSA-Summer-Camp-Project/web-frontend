import React from "react";
import Link from "next/link";
import type { Job } from "@/types";
import { Badge } from "@/components/ui";
import { Users, Clock, Tag } from "lucide-react";

export const JobCard = ({ job }: { job: Job }) => {
  const applicationCount = job._count?.applications ?? 0;
  const isDirect = job.source === "DIRECT";

  return (
    <Link
      href={`/customer/jobs/${job.id}`}
      className="flex flex-col p-6 rounded-sm border border-border bg-surface hover:border-primary/40 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={isDirect ? "accent" : "default"} size="sm">
              {isDirect ? "Direct Request" : "Marketplace"}
            </Badge>
            {job.category?.name && (
              <Badge variant="default" size="sm" className="text-ink-muted">
                <Tag size={12} className="mr-1" />
                {job.category.name}
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-bold text-ink line-clamp-1">
            {job.title}
          </h3>
          {job.description && (
            <p className="text-sm text-ink-muted mt-1 line-clamp-2">
              {job.description}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="font-bold text-lg text-primary block tabular-nums">
            {typeof job.budget === "number"
              ? job.budget.toLocaleString()
              : job.budget}{" "}
            ETB
          </span>
          <Badge status={job.status} className="mt-2">
            {job.status.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-ink-muted border-t border-border pt-4 mt-auto">
        <span className="flex items-center gap-1">
          <Clock size={13} />
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1 font-medium text-ink-secondary">
          <Users size={13} />
          {applicationCount}{" "}
          {applicationCount === 1 ? "applicant" : "applicants"}
        </span>
      </div>
    </Link>
  );
};
