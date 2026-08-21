"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  ShieldCheck,
  Briefcase,
  Search,
  MessageSquare,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RatingStars } from "@/components/ui/RatingStars";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerReviews } from "@/hooks/useReviews";

export default function CustomerProfilePage() {
  const user = useAuthStore((state) => state.user);
  const customerProfileId = user?.customerProfile?.id || user?.id || "";

  const { data: reviews, isLoading: reviewsLoading } = useCustomerReviews(
    customerProfileId,
    undefined,
    !!customerProfileId,
  );

  const displayName = user?.name || user?.fullName || "Customer Account";
  const displayEmail = user?.email || "No email provided";
  const displayPhone = user?.phone || "No phone number set";
  const avatarSrc = user?.photoUrl || user?.avatarUrl || undefined;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const ratingAvg = user?.customerProfile?.ratingAvg
    ? Number(user.customerProfile.ratingAvg)
    : 5.0;

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Top Profile Header Card */}
      <section className="bg-surface rounded-sm border border-border p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar
              src={avatarSrc}
              name={displayName}
              size="xl"
              className="ring-4 ring-primary/10 border border-border"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
                  {displayName}
                </h1>
                <Badge variant="accent" size="sm">
                  Customer
                </Badge>
                <Badge
                  variant="success"
                  size="sm"
                  leftIcon={<ShieldCheck size={12} />}
                >
                  Verified Client
                </Badge>
              </div>

              <p className="text-sm text-ink-muted">
                ServiceHub Marketplace Client
              </p>

              {user?.customerProfile?.bio && (
                <p className="text-sm text-ink-secondary pt-2 max-w-xl italic">
                  &ldquo;{user.customerProfile.bio}&rdquo;
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/customer/jobs/new" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Briefcase size={16} />}
                className="w-full sm:w-auto"
              >
                Post a Job
              </Button>
            </Link>
            <Link href="/customer/workers" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Search size={16} />}
                className="w-full sm:w-auto"
              >
                Find Specialists
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact & Account Details Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border text-sm">
          <div className="flex items-center gap-3 text-ink-secondary">
            <div className="w-8 h-8 rounded-sm bg-surface-alt flex items-center justify-center text-primary shrink-0 border border-border">
              <Mail size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-ink-muted block">Email</span>
              <span className="font-semibold text-ink truncate block">
                {displayEmail}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-ink-secondary">
            <div className="w-8 h-8 rounded-sm bg-surface-alt flex items-center justify-center text-primary shrink-0 border border-border">
              <Phone size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-ink-muted block">Phone</span>
              <span className="font-semibold text-ink truncate block">
                {displayPhone}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-ink-secondary">
            <div className="w-8 h-8 rounded-sm bg-surface-alt flex items-center justify-center text-primary shrink-0 border border-border">
              <Calendar size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-ink-muted block">Member Since</span>
              <span className="font-semibold text-ink block">{joinedDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reputation & Trust Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Score Card */}
        <div className="bg-surface rounded-sm border border-border p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Client Reputation
            </span>
            <Award className="text-amber-500" size={20} />
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-serif font-bold text-ink tabular-nums">
              {ratingAvg.toFixed(1)}
            </span>
            <div className="space-y-1">
              <RatingStars rating={ratingAvg} size="standard" />
              <span className="text-xs text-ink-muted block">
                {reviews?.length ?? 0}{" "}
                {(reviews?.length ?? 0) === 1 ? "review" : "reviews"} received
              </span>
            </div>
          </div>

          <p className="text-xs text-ink-muted">
            Calculated from feedback left by verified professionals after job
            completion.
          </p>
        </div>

        {/* Contract Security Card */}
        <div className="bg-surface rounded-sm border border-border p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Payment Security
            </span>
            <ShieldCheck className="text-success" size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2 text-success font-bold text-lg mb-1">
              <CheckCircle2 size={18} />
              <span>Escrow Protected</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              All direct hires and marketplace contracts are backed by
              ServiceHub escrow milestone guarantees.
            </p>
          </div>

          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            100% Milestone Assurance
          </span>
        </div>

        {/* Verification Status Card */}
        <div className="bg-surface rounded-sm border border-border p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Account Status
            </span>
            <User className="text-primary" size={20} />
          </div>

          <div>
            <span className="text-lg font-bold text-ink block mb-1">
              Active Member
            </span>
            <p className="text-xs text-ink-muted leading-relaxed">
              Full access to browse certified specialists, receive proposals,
              and hire directly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm">
              Standard Tier
            </Badge>
          </div>
        </div>
      </div>

      {/* Reviews from Providers Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
            <MessageSquare className="text-primary" size={22} />
            Reviews from Professionals {reviews ? `(${reviews.length})` : ""}
          </h2>
        </div>

        {reviewsLoading ? (
          <div className="p-12 text-center bg-surface border border-border rounded-sm text-ink-muted">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>Loading reviews from service providers...</span>
          </div>
        ) : !reviews?.length ? (
          <EmptyState
            title="No provider reviews yet"
            description="As you hire and complete jobs with professionals on ServiceHub, their feedback on your communication and collaboration will be displayed here."
            icon={<MessageSquare size={48} className="text-ink-muted/40" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => {
              const workerName = review.worker?.user?.name || "Professional";
              const formattedDate = review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recently";

              return (
                <div
                  key={review.id}
                  className="bg-surface border border-border rounded-sm p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={undefined} name={workerName} size="sm" />
                      <div>
                        <span className="text-sm font-bold text-ink block">
                          {workerName}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <RatingStars rating={review.rating} size="compact" />
                  </div>

                  {review.job?.title && (
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted font-medium truncate">
                      <Briefcase size={12} className="text-primary shrink-0" />
                      <span className="truncate">{review.job.title}</span>
                    </div>
                  )}

                  {review.comment ? (
                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed bg-surface-alt p-3.5 rounded-sm border border-border italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  ) : (
                    <p className="text-xs text-ink-muted italic">
                      5-star rating left with no written comment.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
