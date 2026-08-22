"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useCreateReport } from "@/hooks/useReports";
import { toast } from "react-hot-toast";
import type { ReportReason } from "@/types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId?: string;
  jobId?: string;
  targetName?: string;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "SCAM", label: "Scam or Fraud" },
  { value: "NO_SHOW", label: "No Show / Did Not Arrive" },
  { value: "POOR_QUALITY", label: "Extremely Poor Quality" },
  { value: "HARASSMENT", label: "Harassment or Inappropriate Behavior" },
  { value: "OTHER", label: "Other" },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportedUserId,
  jobId,
  targetName = "User",
}) => {
  const [reason, setReason] = useState<ReportReason>("OTHER");
  const [description, setDescription] = useState("");
  
  const { mutate: createReport, isPending } = useCreateReport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error("Please select a reason for reporting");
      return;
    }
    
    if (!description || description.trim().length < 10) {
      toast.error("Please provide a more detailed description (min 10 characters)");
      return;
    }

    createReport(
      {
        reportedUserId,
        jobId,
        reason,
        description,
      },
      {
        onSuccess: () => {
          toast.success("Report submitted successfully. Our team will review it shortly.");
          setReason("OTHER");
          setDescription("");
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to submit report. Please try again.");
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Report ${targetName}`}
      description="Please provide details about your issue. This report will be reviewed by our moderation team."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <Select
          label="Reason for reporting"
          value={reason}
          onChange={(e) => setReason(e.target.value as ReportReason)}
          options={REPORT_REASONS}
          required
        />
        
        <Textarea
          label="Detailed description"
          placeholder="Please explain what happened in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          hint="Minimum 10 characters"
        />

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            isLoading={isPending}
          >
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};
