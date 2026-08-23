"use client";

import React, { useId } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      children,
      className = "",
      containerClassName = "",
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-ink select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none rounded-sm border bg-surface-alt py-2.5 pl-3.5 pr-10 text-sm text-ink focus:outline-none focus:ring-2 transition-colors duration-150 cursor-pointer ${
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border-strong"
            } ${
              disabled
                ? "opacity-60 cursor-not-allowed bg-surface-alt text-ink-muted pointer-events-none"
                : ""
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 flex items-center justify-center text-ink-muted pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-error flex items-center gap-1 font-medium mt-0.5">
            <AlertCircle size={14} />
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-ink-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
