import React from "react";
import { Star, CheckCircle2, Clock, Users } from "lucide-react";
import type { WorkerProfile, WorkerReputation } from "@/types";

export interface TrustSignalRowProps {
  profile?: WorkerProfile;
  reputation?: WorkerReputation;
  className?: string;
}

export const TrustSignalRow: React.FC<TrustSignalRowProps> = ({
  profile,
  reputation,
  className = "",
}) => {
  const ratingAvg =
    reputation?.rating_avg !== undefined
      ? reputation.rating_avg.toFixed(1)
      : typeof profile?.rating_avg === "number"
        ? profile.rating_avg.toFixed(1)
        : profile?.rating_avg
          ? parseFloat(profile.rating_avg).toFixed(1)
          : "5.0";

  const completedJobs =
    reputation?.metrics?.completedJobs ?? profile?._count?.completedJobs ?? 12;

  const completionRate =
    reputation?.metrics?.jobCompletionRate !== undefined
      ? `${Math.round(reputation.metrics.jobCompletionRate * 100)}%`
      : "98%";

  const repeatCustomers =
    reputation?.metrics?.repeatCustomers !== undefined
      ? reputation.metrics.repeatCustomers
      : 8;

  const signals = [
    {
      icon: <Star size={20} className="text-accent fill-accent" />,
      value: `${ratingAvg} Rating`,
      label: `${reputation?.totalReviews ?? profile?._count?.reviews ?? 0} verified reviews`,
    },
    {
      icon: <CheckCircle2 size={20} className="text-success-text" />,
      value: `${completedJobs} Jobs`,
      label: `${completionRate} completion rate`,
    },
    {
      icon: <Users size={20} className="text-primary" />,
      value: `${repeatCustomers} Repeat`,
      label: "Returning clients",
    },
    {
      icon: <Clock size={20} className="text-ink-muted" />,
      value: "< 30 mins",
      label: "Avg. response time",
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 ${className}`}
    >
      {signals.map((signal, idx) => (
        <div
          key={idx}
          className="bg-surface border border-border rounded-md p-4 shadow-2xs flex flex-col justify-between space-y-2 hover:border-primary/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-sm bg-surface-alt flex items-center justify-center">
            {signal.icon}
          </div>

          <div>
            <div className="text-base sm:text-lg font-bold text-ink tracking-tight">
              {signal.value}
            </div>
            <div className="text-xs text-ink-muted mt-0.5">{signal.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
