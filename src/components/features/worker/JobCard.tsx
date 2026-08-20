import React from "react";
import Link from "next/link";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import type { Job } from "@/types";

export interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  className = "",
}) => {
  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`bg-surface border border-border rounded-md p-5 shadow-xs hover:shadow-sm hover:border-border-strong transition-all flex flex-col justify-between gap-4 ${className}`}
    >
      <div className="flex flex-col gap-2.5">
        {/* Category & Status Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
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

          <PriceDisplay amount={job.budget} size="lg" />
        </div>

        {/* Job Title */}
        <Link
          href={`/worker/jobs/${job.id}`}
          className="font-serif text-lg font-bold text-ink hover:text-primary transition-colors tracking-tight line-clamp-2"
        >
          {job.title}
        </Link>

        {/* Job Description Preview */}
        {job.description && (
          <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}
      </div>

      {/* Meta Information & CTA Actions */}
      <div className="pt-3 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-ink-muted flex-wrap">
          <span className="flex items-center gap-1">
            <Clock size={13} className="shrink-0" />
            <span>{postedDate}</span>
          </span>

          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} className="shrink-0" />
              <span>{job.location}</span>
            </span>
          )}

          {job._count?.applications !== undefined && (
            <span className="flex items-center gap-1">
              <Users size={13} className="shrink-0" />
              <span>{job._count.applications} proposals</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <Link href={`/worker/jobs/${job.id}`}>
            <Button variant="secondary" size="sm">
              View
            </Button>
          </Link>

          {onApply ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApply(job)}
              rightIcon={<ArrowRight size={14} />}
            >
              Apply
            </Button>
          ) : (
            <Link href={`/worker/jobs/${job.id}?action=apply`}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight size={14} />}
              >
                Apply
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
