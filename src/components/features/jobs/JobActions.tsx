import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Edit3, Star } from "lucide-react";
import type { Job } from "@/types";

interface JobActionsProps {
  job: Job;
  hasReview: boolean;
  onCancelClick: () => void;
  onCompleteClick: () => void;
  onEditClick: () => void;
  onReviewClick: () => void;
  onPayClick?: () => void;
}

export const JobActions: React.FC<JobActionsProps> = ({
  job,
  hasReview,
  onCancelClick,
  onCompleteClick,
  onEditClick,
  onReviewClick,
  onPayClick,
}) => {
  const isOpen = job.status === "OPEN";
  const isInProgress = job.status === "IN_PROGRESS";
  const isCompleted = job.status === "COMPLETED";
  const isCancelled = job.status === "CANCELLED";

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0">
      <div className="bg-surface-alt px-6 py-4 rounded-sm border border-border w-full sm:w-auto text-right">
        <span className="block text-xs text-ink-muted mb-1 font-semibold uppercase tracking-wider">
          Budget
        </span>
        <span className="text-2xl font-bold text-primary tabular-nums">
          {typeof job.budget === "number"
            ? job.budget.toLocaleString()
            : job.budget}{" "}
          ETB
        </span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
        {isOpen && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              leftIcon={<Edit3 size={14} />}
            >
              Edit Job
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onCancelClick}
              className="w-full sm:w-auto"
            >
              Cancel Job
            </Button>
          </>
        )}

        {isInProgress && (
          <>
            {onPayClick && (
              <Button variant="secondary" size="sm" onClick={onPayClick}>
                Pay & Start Work
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 size={16} />}
              onClick={onCompleteClick}
            >
              Mark as Completed
            </Button>
            <Button variant="destructive" size="sm" onClick={onCancelClick}>
              Cancel Job
            </Button>
          </>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2">
            <Badge variant="success" size="lg" dot>
              Job Completed
            </Badge>
            {hasReview ? (
              <Badge
                variant="accent"
                size="lg"
                leftIcon={
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                }
              >
                Reviewed
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                leftIcon={
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                }
                onClick={onReviewClick}
              >
                Leave Review
              </Button>
            )}
          </div>
        )}

        {isCancelled && (
          <Badge variant="error" size="lg" dot>
            Job Cancelled
          </Badge>
        )}
      </div>
    </div>
  );
};
