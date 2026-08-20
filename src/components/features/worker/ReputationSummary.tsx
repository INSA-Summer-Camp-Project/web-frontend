import React from "react";
import { Star } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";
import type { WorkerReputation } from "@/types";

export interface ReputationSummaryProps {
  reputation: WorkerReputation;
  className?: string;
}

export const ReputationSummary: React.FC<ReputationSummaryProps> = ({
  reputation,
  className = "",
}) => {
  const total = reputation.totalReviews || 1;
  const distribution = reputation.distribution || {
    "5": Math.round(total * 0.8),
    "4": Math.round(total * 0.15),
    "3": Math.round(total * 0.05),
    "2": 0,
    "1": 0,
  };

  const starLevels = [5, 4, 3, 2, 1];

  return (
    <div
      className={`bg-surface border border-border rounded-md p-6 shadow-xs space-y-6 ${className}`}
    >
      <div className="border-b border-border pb-3">
        <h2 className="font-serif text-lg font-bold text-ink">
          Ratings & Reviews
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Verified feedback from customers who hired this service provider.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left score highlight */}
        <div className="flex flex-col items-center justify-center p-6 bg-surface-alt/40 rounded-md border border-border text-center space-y-1.5">
          <div className="font-serif text-4xl sm:text-5xl font-bold text-ink tracking-tight">
            {reputation.rating_avg.toFixed(1)}
          </div>

          <RatingStars rating={reputation.rating_avg} size="standard" />

          <span className="text-xs text-ink-muted mt-1">
            Based on {reputation.totalReviews} verified reviews
          </span>
        </div>

        {/* Right Distribution Bars */}
        <div className="md:col-span-2 space-y-2">
          {starLevels.map((stars) => {
            const count = distribution[stars.toString()] || 0;
            const percentage =
              total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-ink-secondary flex items-center gap-1 shrink-0">
                  <span>{stars}</span>
                  <Star size={12} className="text-accent fill-accent" />
                </span>

                {/* Progress bar */}
                <div className="flex-1 h-2.5 bg-surface-alt rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right text-ink-muted tabular-nums font-mono">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
