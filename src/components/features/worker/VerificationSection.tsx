"use client";

import React from "react";
import { ShieldCheck, Phone, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { WorkerProfile, UserProfile } from "@/types";

export interface VerificationSectionProps {
  profile?: WorkerProfile;
  user?: UserProfile;
  className?: string;
}

export const VerificationSection: React.FC<VerificationSectionProps> = ({
  profile,
  user,
  className = "",
}) => {
  const isPhoneVerified = !!(user?.phone || profile?.user?.phone);
  const isIdentityVerified = true;

  return (
    <div
      className={`bg-surface border border-border rounded-md p-6 shadow-xs space-y-6 ${className}`}
    >
      <div className="border-b border-border pb-4">
        <h2 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
          <ShieldCheck size={20} className="text-primary" />
          <span>Trust & Verification Status</span>
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Verified status increases customer trust and unlocks priority job
          invitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone Verification Card */}
        <div className="p-4 rounded-md border border-border bg-surface-alt/30 flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isPhoneVerified
                ? "bg-success-light text-success-text"
                : "bg-surface-alt text-ink-muted"
            }`}
          >
            <Phone size={18} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-ink">
                Phone Authentication
              </span>
              <Badge
                status={isPhoneVerified ? "ACCEPTED" : "PENDING"}
                size="sm"
                dot
              >
                {isPhoneVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              {profile?.user?.phone ||
                user?.phone ||
                "Primary contact number verified via Telegram."}
            </p>
          </div>
        </div>

        {/* Identity & Background Check Card */}
        <div className="p-4 rounded-md border border-border bg-surface-alt/30 flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isIdentityVerified
                ? "bg-primary-light text-primary"
                : "bg-surface-alt text-ink-muted"
            }`}
          >
            <CheckCircle2 size={18} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-ink">
                Service Provider Account
              </span>
              <Badge
                status={isIdentityVerified ? "ACCEPTED" : "PENDING"}
                size="sm"
              >
                {isIdentityVerified ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Account registered and enabled to submit bids on open jobs.
            </p>
          </div>
        </div>
      </div>

      {/* Safety info footer */}
      <div className="flex items-center gap-2.5 p-3 rounded-md bg-surface-alt/60 text-xs text-ink-muted border border-border/60">
        <Lock size={14} className="text-ink-muted shrink-0" />
        <span>
          Your personal data is encrypted. Client contact information is only
          shared once an agreement is confirmed.
        </span>
      </div>
    </div>
  );
};
