"use client";

import React, { useEffect, useCallback, useRef } from "react";
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

const maxWidthMap: Record<NonNullable<ModalProps["maxWidth"]>, string> = {
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
  const panelRef = useRef<HTMLDivElement>(null);

  // Stable Escape handler — recreated only when deps actually change
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") onClose();
    },
    [closeOnEscape, onClose],
  );

  // Scroll lock + Escape listener — both are tied to the same isOpen gate
  useEffect(() => {
    if (!isOpen) return;

    // Save whatever overflow was set before we locked it
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Restore exactly what was there before, not a hardcoded value
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Move focus into the panel when the modal opens so Tab starts inside it
  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const hasHeader = Boolean(title || description);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-layer-modal flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Blurred backdrop — clicking it closes the modal when allowed */}
      <div
        data-testid="modal-backdrop"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/*
        Panel — sits above the backdrop via z-10.
        tabIndex={-1} lets us programmatically focus it without it
        appearing in the natural Tab order.
      */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={[
          "relative w-full z-10 my-auto",
          "bg-surface rounded-lg shadow-lg border border-border",
          "flex flex-col overflow-hidden",
          "outline-none", // suppress the focus ring on the container itself
          "animate-in fade-in zoom-in-95 duration-150",
          maxWidthMap[maxWidth],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ── Header ── */}
        {hasHeader && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-border shrink-0">
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

        {/* Close button when there is no header at all */}
        {!hasHeader && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-20 rounded-sm p-1 text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <X size={20} />
          </button>
        )}

        {/* ── Body ── scrollable, height adapts to what header/footer are present */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 max-h-[calc(85vh-8rem)]">
          {children}
        </div>

        {/* ── Footer ── */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border bg-surface-alt/40 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
