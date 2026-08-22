"use client";

import React from "react";
import { MessageSquare, Calendar, Zap } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import type { WorkerProfile, WorkerReputation } from "@/types";

export interface WorkerProfileHeaderProps {
  profile: WorkerProfile;
  reputation?: WorkerReputation;
  onDirectRequest?: () => void;
  isDirectRequestLoading?: boolean;
  className?: string;
}

export const WorkerProfileHeader: React.FC<WorkerProfileHeaderProps> = ({
  profile,
  reputation,
  onDirectRequest,
  isDirectRequestLoading = false,
  className = "",
}) => {
  const name = profile.user?.name || "Service Professional";
  const rating =
    reputation?.ratingAvg !== undefined
      ? reputation.ratingAvg
      : typeof profile.ratingAvg === "number"
        ? profile.ratingAvg
        : profile.ratingAvg
          ? parseFloat(profile.ratingAvg as string)
          : 5.0;

  const totalReviews = reputation?.totalReviews ?? profile._count?.reviews ?? 0;

  const badges = reputation?.badges || ["Verified Provider", "Top Rated"];

  return (
    <div
      className={`bg-surface border border-border rounded-md p-6 sm:p-8 shadow-xs ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left info column with avatar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center md:items-start gap-5">
          <Avatar
            src={
              profile.profilePhoto ||
              profile.user?.photoUrl ||
              profile.user?.avatarUrl
            }
            name={name}
            size="xl"
            className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary/20 shrink-0"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                {name}
              </h1>
              <Badge status="ACCEPTED" size="sm" dot>
                Verified Pro
              </Badge>
            </div>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-3 flex-wrap">
              <RatingStars
                rating={rating}
                totalReviews={totalReviews}
                showValue={true}
                size="standard"
              />

              {profile.experienceYears !== undefined && (
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{profile.experienceYears} Years Experience</span>
                </span>
              )}
            </div>

            {/* Badges List */}
            {badges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent-dark border border-accent/20"
                  >
                    <Zap size={11} className="text-accent" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right CTA & Price box */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 p-4 md:p-0 bg-surface-alt/40 md:bg-transparent rounded-md border md:border-none border-border shrink-0">
          {profile.paymentRate && (
            <div className="flex flex-col md:items-end">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">
                Starting Rate
              </span>
              <PriceDisplay
                amount={profile.paymentRate}
                size="xl"
                period="/ hour"
              />
            </div>
          )}

          {onDirectRequest && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onDirectRequest}
              isLoading={isDirectRequestLoading}
              leftIcon={<MessageSquare size={16} />}
              className="w-full sm:w-auto"
            >
              Direct Booking
            </Button>
          )}
        </div>
      </div>

      {/* Bio text */}
      {profile.bio && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-ink-secondary leading-relaxed max-w-3xl whitespace-pre-line">
            {profile.bio}
          </p>
        </div>
      )}
    </div>
  );
};
