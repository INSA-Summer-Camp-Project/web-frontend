import React from "react";
import type { JobStatus, ApplicationStatus } from "@/types";

export type BadgeVariant =
  "default" | "primary" | "success" | "warning" | "error" | "accent";

export type BadgeStatus =
  JobStatus | ApplicationStatus | "AVAILABLE" | "VERIFIED" | "DIRECT";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  status?: BadgeStatus | string;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const statusToVariantMap: Record<string, BadgeVariant> = {
  OPEN: "primary",
  AVAILABLE: "primary",
  PENDING: "warning",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  ACCEPTED: "success",
  VERIFIED: "success",
  REJECTED: "error",
  DECLINED: "error",
  CANCELLED: "default",
  DIRECT: "accent",
};

const variantStyles: Record<BadgeVariant, string> = {
  // DESIGN.md Section 18: Badge Contrast (WCAG AA compliant darker text)
  default: "bg-surface-alt text-ink-secondary border border-border",
  primary: "bg-primary-light text-primary-dark border border-primary/20",
  success: "bg-success-light text-success-text border border-success/20",
  warning: "bg-warning-light text-warning-text border border-warning/20",
  error: "bg-error-light text-error-text border border-error/20",
  accent: "bg-accent-light text-accent-text border border-accent/20",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-ink-muted",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  accent: "bg-accent",
};

const sizeStyles = {
  sm: "py-0.5 px-2 text-[11px] gap-1",
  md: "py-1 px-2.5 text-xs gap-1.5",
  lg: "py-1.5 px-3 text-sm gap-2",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  size = "md",
  dot = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  // Resolve variant from status if variant is not explicitly passed
  const activeVariant: BadgeVariant =
    variant || (status ? statusToVariantMap[status] || "default" : "default");

  const formattedStatusText =
    !children && status
      ? status
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : children;

  return (
    <span
      className={`inline-flex items-center justify-center font-semibold rounded-full select-none ${variantStyles[activeVariant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[activeVariant]}`}
          aria-hidden="true"
        />
      )}
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{formattedStatusText}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </span>
  );
};
