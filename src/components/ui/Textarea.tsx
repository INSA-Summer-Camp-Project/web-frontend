"use client";

import React, { useId } from "react";
import { AlertCircle } from "lucide-react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      placeholder,
      className = "",
      containerClassName = "",
      disabled,
      id,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-ink select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex w-full">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-sm border bg-surface-alt p-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 transition-colors duration-150 resize-y min-h-[100px] ${
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border-strong"
            } ${
              disabled
                ? "opacity-60 cursor-not-allowed bg-surface-alt text-ink-muted"
                : ""
            } ${className}`}
            {...props}
          />
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

Textarea.displayName = "Textarea";
