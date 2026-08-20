"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  badge,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-border mb-6 ${className}`}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-primary transition-colors mb-1 w-fit group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>{backLabel}</span>
          </Link>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink tracking-tight">
            {title}
          </h1>
          {badge}
        </div>

        {subtitle && (
          <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
