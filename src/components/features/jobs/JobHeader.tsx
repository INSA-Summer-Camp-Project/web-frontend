import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Tag, Clock, Users } from "lucide-react";
import type { Job } from "@/types";

interface JobHeaderProps {
  job: Job;
}

export const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  const isDirect = job.source === "DIRECT";

  return (
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

      <h1 className="text-3xl font-serif font-bold text-ink mb-3">
        {job.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Badge status={job.status}>{job.status.replace(/_/g, " ")}</Badge>
        <span className="flex items-center gap-1.5 text-ink-muted">
          <Clock size={14} /> Posted{" "}
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1.5 text-ink-muted">
          <Users size={14} /> {job._count?.applications ?? job.applications?.length ?? 0}{" "}
          {(job._count?.applications ?? job.applications?.length ?? 0) === 1
            ? "proposal"
            : "proposals"}
        </span>
      </div>
    </div>
  );
};
