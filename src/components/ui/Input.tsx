"use client";

import React, { useState, useId } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      placeholder,
      type = "text",
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const isPasswordType = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const activeType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-ink select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center justify-center text-ink-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={activeType}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full rounded-sm border bg-surface-alt py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 transition-colors duration-150",
              leftIcon ? "pl-10" : "pl-3.5",
              rightIcon || isPasswordType ? "pr-10" : "pr-3.5",
              error
                ? "border-error focus:border-error focus:ring-error/20"
                : "border-border focus:border-primary focus:ring-primary/20 hover:border-border-strong",
              disabled
                ? "opacity-60 cursor-not-allowed bg-surface-alt text-ink-muted"
                : "",
              className,
            )}
            {...props}
          />
          {isPasswordType ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 flex items-center justify-center text-ink-muted hover:text-ink transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 flex items-center justify-center text-ink-muted pointer-events-none">
                {rightIcon}
              </div>
            )
          )}
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

Input.displayName = "Input";
