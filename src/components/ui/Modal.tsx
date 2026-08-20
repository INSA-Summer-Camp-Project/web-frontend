"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
  className = "",
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-layer-modal flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop overlay */}
      <div
        data-testid="modal-backdrop"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative w-full ${maxWidthMap[maxWidth]} bg-surface rounded-lg shadow-lg border border-border flex flex-col z-10 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${className}`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
            <div className="flex flex-col gap-1 pr-6">
              {title && (
                <h2
                  id="modal-title"
                  className="font-serif text-xl font-bold text-ink tracking-tight"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-sm text-ink-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-sm p-1 text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Without title header close button fallback */}
        {!title && !description && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-20 rounded-sm p-1 text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <X size={20} />
          </button>
        )}

        {/* Body content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {children}
        </div>

        {/* Footer actions */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border bg-surface-alt/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
