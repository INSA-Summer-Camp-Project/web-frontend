import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An error occurred while loading content. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  icon,
  actionButton,
  children,
  className = "",
}) => {
  return (
    <div
      role="alert"
      className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-error-light/30 border border-error/20 rounded-lg ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-error-light flex items-center justify-center text-error mb-4 border border-error/20">
        {icon || <AlertCircle size={24} />}
      </div>

      <h3 className="font-serif text-lg font-bold text-ink mb-1 tracking-tight">
        {title}
      </h3>

      {message && (
        <p className="text-sm text-ink-muted max-w-md mb-6 leading-relaxed">
          {message}
        </p>
      )}

      {onRetry && (
        <Button
          variant="secondary"
          size="md"
          onClick={onRetry}
          leftIcon={<RotateCcw size={16} />}
        >
          {retryLabel}
        </Button>
      )}

      {actionButton}
      {children}
    </div>
  );
};
