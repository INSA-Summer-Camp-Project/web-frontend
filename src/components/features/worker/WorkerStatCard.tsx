import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export interface WorkerStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isCurrency?: boolean;
  currency?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  variant?: "primary" | "accent" | "success" | "warning";
  className?: string;
}

const variantIconStyles = {
  primary: "bg-primary-light text-primary border-primary/20",
  accent: "bg-accent-light text-accent-text border-accent/20",
  success: "bg-success-light text-success-text border-success/20",
  warning: "bg-warning-light text-warning-text border-warning/20",
};

export const WorkerStatCard: React.FC<WorkerStatCardProps> = ({
  label,
  value,
  icon,
  isCurrency = false,
  currency = "ETB",
  change,
  changeType = "neutral",
  variant = "primary",
  className = "",
}) => {
  return (
    <div
      className={`bg-surface border border-border rounded-md p-5 shadow-xs flex flex-col justify-between transition-shadow hover:shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-sm flex items-center justify-center border shrink-0 ${variantIconStyles[variant]}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {isCurrency ? (
          <PriceDisplay amount={value} currency={currency} size="xl" />
        ) : (
          <span className="font-serif text-2xl md:text-3xl font-bold text-ink tracking-tight tabular-nums">
            {value}
          </span>
        )}

        {change && (
          <span
            className={`text-xs font-medium ${
              changeType === "positive"
                ? "text-success-text"
                : changeType === "negative"
                  ? "text-error-text"
                  : "text-ink-muted"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export const WorkerStatCardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      data-testid="stat-card-skeleton"
      className={`bg-surface border border-border rounded-md p-5 shadow-xs flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Skeleton width={80} height={14} />
        <Skeleton width={40} height={40} className="rounded-sm" />
      </div>
      <div className="space-y-2">
        <Skeleton width={120} height={28} />
        <Skeleton width={70} height={12} />
      </div>
    </div>
  );
};
