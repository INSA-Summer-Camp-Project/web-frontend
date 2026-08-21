"use client";

import React, { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "@/components/ui/Toast";
import { useCreateReview } from "@/hooks/useReviews";

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  workerName?: string;
  onSuccess?: () => void;
}

const ratingLabels: Record<number, string> = {
  1: "Terrible",
  2: "Poor",
  3: "Average",
  4: "Very Good",
  5: "Exceptional Service",
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  jobId,
  workerName = "the specialist",
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const { mutate: createReview, isPending } = useCreateReview();

  const activeRating = hoverRating ?? rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating between 1 and 5.");
      return;
    }

    createReview(
      {
        jobId,
        rating,
        comment: comment.trim() ? comment.trim() : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Thank you! Your review has been submitted.");
          setRating(5);
          setComment("");
          onSuccess?.();
          onClose();
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to submit review. Please try again.",
          );
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review ${workerName}`}
      description={`Share your feedback about the service provided by ${workerName}. Your review helps other customers and rewards great work.`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Star Rating Selector */}
        <div className="flex flex-col items-center justify-center p-5 bg-surface-alt rounded-sm border border-border space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Rate Your Experience
          </span>

          <div
            className="flex items-center gap-2 py-1"
            role="radiogroup"
            aria-label="Star rating"
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= activeRating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 hover:scale-125 active:scale-95 transition-transform cursor-pointer focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      isFilled
                        ? "fill-amber-500 text-amber-500"
                        : "fill-border text-border"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-sm font-semibold text-primary font-serif">
            {ratingLabels[activeRating] || ""}
          </span>
        </div>

        {/* Written Review Feedback */}
        <div>
          <Textarea
            label="Feedback & Comments (Optional)"
            placeholder="What went well? Did the specialist arrive on time, communicate clearly, and complete the work to your satisfaction?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            helperText={`${comment.length}/1000 characters`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
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
            variant="primary"
            isLoading={isPending}
            leftIcon={<MessageSquare size={16} />}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
