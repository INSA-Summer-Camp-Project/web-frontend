"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

export interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "compact" | "standard" | "lg";
  showValue?: boolean;
  totalReviews?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeMap = {
  compact: 16,
  standard: 20,
  lg: 24,
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = "standard",
  showValue = false,
  totalReviews,
  interactive = false,
  onChange,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const iconSize = sizeMap[size];
  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="inline-flex items-center gap-0.5"
        role="img"
        aria-label={`Rating: ${rating} out of ${maxRating} stars`}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = activeRating >= starValue;
          const isHalfFilled = !isFilled && activeRating >= starValue - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`p-0 bg-transparent border-0 inline-flex items-center justify-center ${
                interactive
                  ? "cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                  : "cursor-default"
              }`}
              aria-label={interactive ? `Rate ${starValue} stars` : undefined}
            >
              <Star
                size={iconSize}
                className={`transition-colors ${
                  isFilled
                    ? "fill-accent text-accent"
                    : isHalfFilled
                      ? "fill-accent/50 text-accent"
                      : "fill-border text-border"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-ink-secondary tabular-nums select-none ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}

      {totalReviews !== undefined && (
        <span className="text-xs text-ink-muted select-none">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};
