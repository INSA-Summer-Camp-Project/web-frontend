import React from "react";
import {
  Users,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import type { Job } from "@/types";

export interface JobDetailCardProps {
  job: Job;
  className?: string;
}

export const JobDetailCard: React.FC<JobDetailCardProps> = ({
  job,
  className = "",
}) => {
  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`bg-surface border border-border rounded-md shadow-xs overflow-hidden ${className}`}
    >
      {/* Header section */}
      <div className="p-6 border-b border-border bg-surface-alt/30">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {job.category && (
                <Badge variant="default" size="sm">
                  {job.category.name}
                </Badge>
              )}
              <Badge status={job.status} size="sm" dot />
              {job.source === "DIRECT" && (
                <Badge status="DIRECT" size="sm">
                  Direct Request
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink tracking-tight">
              {job.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-ink-muted flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-ink-muted shrink-0" />
                <span>Posted on {postedDate}</span>
              </span>

              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-ink-muted shrink-0" />
                  <span>{job.location}</span>
                </span>
              )}

              {job._count?.applications !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-ink-muted shrink-0" />
                  <span>{job._count.applications} Proposals</span>
                </span>
              )}
            </div>
          </div>

          {/* Budget Widget */}
          <div className="flex flex-col md:items-end bg-surface p-4 rounded-sm border border-border shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
              Customer Budget
            </span>
            <PriceDisplay amount={job.budget} size="xl" />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="p-6 border-b border-border space-y-3">
        <h2 className="font-serif text-base font-bold text-ink flex items-center gap-2">
          <Briefcase size={18} className="text-primary" />
          <span>Job Description</span>
        </h2>
        <p className="text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
          {job.description || "No specific details provided by the customer."}
        </p>
      </div>

      {/* Client Overview Card */}
      {job.customer && (
        <div className="p-6 bg-surface-alt/20">
          <h3 className="font-serif text-sm font-bold text-ink mb-3">
            About the Customer
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
              {job.customer.name?.[0] || <UserIcon size={18} />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-ink">
                {job.customer.name || "ServiceHub Customer"}
              </span>
              <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap mt-0.5">
                {job.customer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} />
                    <span>{job.customer.phone}</span>
                  </span>
                )}
                {job.customer.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={12} />
                    <span>{job.customer.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
