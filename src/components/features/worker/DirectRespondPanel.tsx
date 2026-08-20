"use client";

import React, { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export interface DirectRespondPanelProps {
  jobId: string;
  onRespond: (action: "ACCEPT" | "DECLINE") => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const DirectRespondPanel: React.FC<DirectRespondPanelProps> = ({
  onRespond,
  isLoading = false,
  className = "",
}) => {
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const handleDeclineConfirm = async () => {
    await onRespond("DECLINE");
    setIsDeclineModalOpen(false);
  };

  return (
    <>
      <div
        className={`bg-primary-light/40 border border-primary/30 rounded-md p-5 sm:p-6 shadow-xs flex flex-col gap-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <Sparkles size={20} />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-base font-bold text-ink">
              Direct Service Request
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-xl">
              A customer specifically requested your services for this task
              based on your expertise. Please accept to proceed or decline if
              you are unavailable.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-primary/20 flex items-center justify-end gap-3 flex-wrap">
          <Button
            variant="destructive"
            size="md"
            onClick={() => setIsDeclineModalOpen(true)}
            disabled={isLoading}
            leftIcon={<X size={16} />}
          >
            Decline Request
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => onRespond("ACCEPT")}
            isLoading={isLoading}
            leftIcon={<Check size={16} />}
          >
            Accept Request
          </Button>
        </div>
      </div>

      {/* Decline Confirmation Modal */}
      <Modal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        title="Decline Direct Request?"
        description="Are you sure you want to decline this direct booking? The customer will be notified."
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsDeclineModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              isLoading={isLoading}
              onClick={handleDeclineConfirm}
            >
              Confirm Decline
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Declining will release this request. This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};
