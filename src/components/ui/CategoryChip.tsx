"use client";

import React from "react";
import { X } from "lucide-react";

export interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  count?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "py-1 px-2.5 text-xs gap-1.5 min-h-[28px]",
  md: "py-1.5 px-3.5 text-sm gap-2 min-h-[36px]",
  lg: "py-2 px-4.5 text-base gap-2.5 min-h-[42px]",
};

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  selected = false,
  onToggle,
  onRemove,
  icon,
  count,
  size = "md",
  disabled = false,
  className = "",
}) => {
  const isClickable = !disabled && (onToggle || onRemove);

  return (
    <div
      role={onToggle ? "checkbox" : undefined}
      aria-checked={onToggle ? selected : undefined}
      tabIndex={isClickable && onToggle ? 0 : undefined}
      onClick={() => isClickable && onToggle?.()}
      onKeyDown={(e) => {
        if (isClickable && onToggle && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`inline-flex items-center rounded-full font-semibold border transition-all select-none ${
        sizeStyles[size]
      } ${
        selected
          ? "bg-primary-light text-primary-dark border-primary/40 shadow-xs"
          : "bg-surface-alt text-ink-secondary border-border hover:border-border-strong hover:bg-surface-alt/80"
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : isClickable
            ? "cursor-pointer active:scale-98"
            : ""
      } ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{label}</span>

      {count !== undefined && (
        <span
          className={`ml-0.5 text-[0.85em] font-normal tabular-nums rounded-full px-1.5 py-0.2 ${
            selected
              ? "bg-primary/20 text-primary-dark"
              : "bg-border text-ink-muted"
          }`}
        >
          {count}
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          className="ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors focus:outline-none cursor-pointer"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
