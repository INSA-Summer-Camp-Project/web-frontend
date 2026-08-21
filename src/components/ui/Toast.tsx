"use client";

import React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-ink group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans rounded-md px-4 py-3 gap-3 border",
          description: "group-[.toast]:text-ink-muted text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white font-semibold rounded-sm",
          cancelButton:
            "group-[.toast]:bg-surface-alt group-[.toast]:text-ink-secondary font-semibold rounded-sm",
          error:
            "group-[.toaster]:bg-error-light group-[.toaster]:text-error-text group-[.toaster]:border-error/20",
          success:
            "group-[.toaster]:bg-success-light group-[.toaster]:text-success-text group-[.toaster]:border-success/20",
          warning:
            "group-[.toaster]:bg-warning-light group-[.toaster]:text-warning-text group-[.toaster]:border-warning/20",
          info: "group-[.toaster]:bg-info-light group-[.toaster]:text-info-DEFAULT group-[.toaster]:border-info/20",
        },
      }}
      {...props}
    />
  );
};

export { toast };
