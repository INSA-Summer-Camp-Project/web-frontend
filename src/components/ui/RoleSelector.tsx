"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type RoleType = "CUSTOMER" | "WORKER" | "BUSINESS";

export interface RoleOption {
  value: RoleType;
  title: string;
  description: string;
  icon: string;
}

export const DEFAULT_ROLE_OPTIONS: RoleOption[] = [
  {
    value: "CUSTOMER",
    title: "I want to hire help",
    description: "Find trusted local professionals.",
    icon: "search",
  },
  {
    value: "WORKER",
    title: "I want to offer services",
    description: "Connect with local customers.",
    icon: "handyman",
  },
];

export interface RoleSelectorProps {
  value?: RoleType | null;
  onChange?: (role: RoleType) => void;
  options?: RoleOption[];
  variant?: "cards" | "segmented";
  disabled?: boolean;
  name?: string;
  error?: string;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  options = DEFAULT_ROLE_OPTIONS,
  variant = "cards",
  disabled = false,
  name = "role",
  error,
  className,
}) => {
  const handleSelect = (role: RoleType) => {
    if (disabled) return;
    onChange?.(role);
  };

  if (variant === "segmented") {
    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        <div className="inline-flex w-full p-1 bg-surface-alt rounded-sm border border-border">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs md:text-sm font-semibold rounded-sm transition-all duration-150",
                  isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-surface",
                  disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                )}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {option.icon}
                </span>
                <span>
                  {option.value.charAt(0) + option.value.slice(1).toLowerCase()}
                </span>
              </button>
            );
          })}
        </div>
        {error && (
          <p className="text-xs text-error flex items-center gap-1 font-medium mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </div>
    );
  }

  const gridColsClass =
    options.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className={cn("grid gap-3 w-full", gridColsClass)}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer relative group flex flex-col",
                disabled ? "opacity-60 cursor-not-allowed" : "",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => handleSelect(option.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  "h-full rounded-sm border-2 p-3.5 flex flex-col items-center text-center transition-all duration-150 shadow-sm",
                  isSelected
                    ? "border-primary bg-primary-light"
                    : "border-border bg-surface-alt hover:border-border-strong hover:bg-surface",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-transform group-hover:scale-105 border border-border",
                    isSelected
                      ? "bg-surface text-primary"
                      : "bg-surface text-ink-muted",
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {option.icon}
                  </span>
                </div>
                <span className="text-sm font-semibold text-ink mb-0.5">
                  {option.title}
                </span>
                <span className="text-xs text-ink-muted leading-tight">
                  {option.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-error flex items-center gap-1 font-medium mt-0.5 text-center">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
};
