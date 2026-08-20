import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  actionButton,
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-surface-alt/40 border border-dashed border-border rounded-lg ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center text-ink-muted mb-4 border border-border">
        {icon || <FolderOpen size={24} />}
      </div>

      <h3 className="font-serif text-lg font-bold text-ink mb-1 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-ink-muted max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}

      {actionButton}
      {children}
    </div>
  );
};
