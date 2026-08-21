"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Modal } from "@/components/ui/Modal";
import type { Application } from "@/types";

export interface ApplicationStatusBannerProps {
  application: Application;
  onWithdraw?: (applicationId: string) => void | Promise<void>;
  isWithdrawing?: boolean;
  className?: string;
}

export const ApplicationStatusBanner: React.FC<
  ApplicationStatusBannerProps
> = ({ application, onWithdraw, isWithdrawing = false, className = "" }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const appliedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const handleConfirmWithdraw = async () => {
    if (onWithdraw) {
      await onWithdraw(application.id);
      setIsConfirmModalOpen(false);
    }
  };

  const statusConfig = {
    PENDING: {
      title: "Proposal Under Review",
      description:
        "Your proposal has been submitted to the customer and is currently awaiting their review.",
      icon: <Clock size={20} className="text-warning-text" />,
      bgColor: "bg-warning-light/30 border-warning/30",
    },
    ACCEPTED: {
      title: "Proposal Accepted!",
      description:
        "Congratulations! The customer has accepted your proposal. You can now start working on this task.",
      icon: <CheckCircle2 size={20} className="text-success-text" />,
      bgColor: "bg-success-light/30 border-success/30",
    },
    REJECTED: {
      title: "Proposal Not Selected",
      description:
        "The customer decided to proceed with another proposal for this job. Check out other available jobs!",
      icon: <XCircle size={20} className="text-error-text" />,
      bgColor: "bg-error-light/30 border-error/30",
    },
    WITHDRAWN: {
      title: "Proposal Withdrawn",
      description: "You withdrew your proposal for this job.",
      icon: <XCircle size={20} className="text-ink-muted" />,
      bgColor: "bg-surface-alt border-border",
    },
  }[application.status] || {
    title: "Application Status",
    description: "Your application is on file.",
    icon: <AlertCircle size={20} className="text-ink-muted" />,
    bgColor: "bg-surface-alt border-border",
  };

  return (
    <>
      <div
        className={`rounded-md border p-5 sm:p-6 shadow-xs flex flex-col gap-4 ${statusConfig.bgColor} ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{statusConfig.icon}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base font-bold text-ink">
                  {statusConfig.title}
                </h3>
                <Badge status={application.status} size="sm" dot />
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-xl">
                {statusConfig.description}
              </p>
            </div>
          </div>

          {/* Proposal Summary */}
          <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50 shrink-0">
            <span className="text-[11px] font-semibold text-ink-muted">
              Your Proposal
            </span>
            <PriceDisplay amount={application.proposedPrice} size="lg" />
            <span className="text-xs text-ink-muted mt-0.5">
              Est. {application.estimatedTime}
            </span>
          </div>
        </div>

        {/* Footer with date and optional Withdraw button */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap text-xs text-ink-muted">
          <span>Submitted on {appliedDate}</span>

          {application.status === "PENDING" && onWithdraw && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsConfirmModalOpen(true)}
              isLoading={isWithdrawing}
              leftIcon={<Trash2 size={14} />}
            >
              Withdraw Proposal
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Withdraw Proposal?"
        description="Are you sure you want to withdraw your proposal for this job? This action cannot be undone."
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              isLoading={isWithdrawing}
              onClick={handleConfirmWithdraw}
            >
              Confirm Withdrawal
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Your proposed bid of{" "}
          <PriceDisplay amount={application.proposedPrice} size="sm" /> will be
          cancelled.
        </p>
      </Modal>
    </>
  );
};
