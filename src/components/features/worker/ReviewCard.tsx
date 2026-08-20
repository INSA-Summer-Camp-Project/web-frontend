import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import type { Review } from "@/types";

export interface ReviewCardProps {
  review: Review;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  className = "",
}) => {
  const customerName = review.customer?.name || "Verified Customer";
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div
      className={`bg-surface border border-border rounded-md p-5 shadow-2xs space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={review.customer?.avatarUrl}
            name={customerName}
            size="sm"
          />

          <div className="space-y-0.5">
            <span className="text-sm font-bold text-ink block">
              {customerName}
            </span>
            <span className="text-xs text-ink-muted">{formattedDate}</span>
          </div>
        </div>

        {/* Rating Stars */}
        <RatingStars rating={review.rating} size="compact" />
      </div>

      {/* Category / Job Tag if available */}
      {review.job && (
        <div className="flex items-center gap-2">
          {review.job.category && (
            <Badge variant="default" size="sm">
              {review.job.category.name}
            </Badge>
          )}
          {review.job.title && (
            <span className="text-xs text-ink-muted font-medium truncate max-w-xs">
              • {review.job.title}
            </span>
          )}
        </div>
      )}

      {/* Review Comment */}
      {review.comment && (
        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}
    </div>
  );
};
