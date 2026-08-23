import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { UserCheck, Star, Phone, MessageCircle } from "lucide-react";
import { useJobContact } from "@/hooks/useJobs";
import type { Job } from "@/types";

interface WorkerBannerProps {
  job: Job;
  hasReview: boolean;
  onReviewClick: () => void;
}

export const WorkerBanner: React.FC<WorkerBannerProps> = ({
  job,
  hasReview,
  onReviewClick,
}) => {
  const isCompleted = job.status === "COMPLETED";
  const isInProgress = job.status === "IN_PROGRESS";
  const shouldRevealContact = isInProgress || isCompleted;

  const { data: contact, isLoading: contactLoading } = useJobContact(
    job.id,
    shouldRevealContact,
  );

  if (!job.assignedWorker) return null;

  return (
    <div className="bg-success-light/30 border border-success/30 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success-text">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-success-text block">
              Assigned Professional
            </span>
            <span className="font-bold text-ink text-base">
              {job.assignedWorker.user?.name || "Professional Hired"}
            </span>
          </div>
        </div>

        {/* Contact Reveal */}
        {shouldRevealContact && (
          <div className="flex items-center gap-3 mt-1 pt-3 border-t border-success/20">
            {contactLoading ? (
              <span className="text-sm text-ink-muted flex items-center gap-2">
                <div className="w-3 h-3 border border-success border-t-transparent rounded-full animate-spin" />
                Loading contact details...
              </span>
            ) : contact ? (
              <>
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors"
                  >
                    <Phone size={14} className="text-success-text" />
                    {contact.phone}
                  </a>
                )}
                {contact.telegramId && (
                  <a
                    href={`https://t.me/${contact.telegramId.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors"
                  >
                    <MessageCircle size={14} className="text-[#0088cc]" />
                    {contact.telegramId}
                  </a>
                )}
              </>
            ) : (
              <span className="text-sm text-ink-muted">
                No contact info available
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isCompleted && !hasReview && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Star size={14} />}
            onClick={onReviewClick}
          >
            Review Specialist
          </Button>
        )}
        {job.assignedWorker.id && (
          <Link href={`/worker/view/${job.assignedWorker.id}`}>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
