"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isPrimary = variant === "primary";
    const isSecondary = variant === "secondary";
    const isDestructive = variant === "destructive";
    const isGhost = variant === "ghost";

    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]";

    const variantStyles = isPrimary
      ? "bg-primary hover:bg-primary-dark text-white shadow-sm"
      : isSecondary
        ? "border border-border-strong bg-white hover:bg-surface-alt text-ink-secondary active:bg-border shadow-sm"
        : isDestructive
          ? "bg-error hover:bg-error/90 text-white shadow-sm"
          : isGhost
            ? "bg-transparent text-primary hover:bg-primary-light"
            : "";

    const sizeStyles =
      size === "sm"
        ? "py-1.5 px-3 text-xs gap-1.5 min-h-[32px]"
        : size === "lg"
          ? "py-3 px-6 text-base gap-2.5 min-h-[48px]"
          : "py-2.5 px-5 text-sm gap-2 min-h-[40px]";

    const widthStyles = fullWidth ? "w-full" : "";
    const isDisabled = disabled || isLoading;
    const disabledStyles = isDisabled
      ? "opacity-60 cursor-not-allowed active:scale-100 shadow-none pointer-events-none bg-surface-alt text-ink-muted border-transparent"
      : "cursor-pointer";

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${disabledStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              data-testid="loading-spinner"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="inline-flex shrink-0">{leftIcon}</span>
            )}
            <span>{children}</span>
            {rightIcon && (
              <span className="inline-flex shrink-0">{rightIcon}</span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
