"use client";

import React, { useState } from "react";
import {
  User,
  Layers,
  Image as ImageIcon,
  Award,
  ShieldCheck,
} from "lucide-react";
import { useWorkerProfile } from "@/hooks/useWorker";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  BasicInfoSection,
  ServiceCategoriesSection,
  PortfolioSection,
  CertificatesSection,
  VerificationSection,
} from "@/components/features/worker";

type ProfileTab =
  "basic" | "services" | "portfolio" | "certificates" | "verification";

const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { id: "basic", label: "Basic Info", icon: <User size={16} /> },
  { id: "services", label: "Services", icon: <Layers size={16} /> },
  { id: "portfolio", label: "Portfolio", icon: <ImageIcon size={16} /> },
  { id: "certificates", label: "Certificates", icon: <Award size={16} /> },
  {
    id: "verification",
    label: "Verification",
    icon: <ShieldCheck size={16} />,
  },
];

export default function WorkerProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useWorkerProfile();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>("basic");

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Worker Profile"
          subtitle="Manage your professional profile, skills, and credentials."
        />
        <ErrorState
          title="Failed to load profile"
          message="We were unable to retrieve your worker profile information."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="profile-skeleton">
        <PageHeader
          title="Worker Profile"
          subtitle="Manage your professional profile, skills, and credentials."
        />

        {/* Profile Card Header Skeleton */}
        <div className="bg-surface border border-border rounded-md p-6 shadow-xs flex items-center gap-4">
          <Skeleton variant="circular" width={64} height={64} />
          <div className="space-y-2">
            <Skeleton width={180} height={24} />
            <Skeleton width={120} height={16} />
          </div>
        </div>

        {/* Section Skeleton */}
        <div className="bg-surface border border-border rounded-md p-6 shadow-xs space-y-4">
          <Skeleton width={160} height={20} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
          <Skeleton height={80} />
        </div>
      </div>
    );
  }

  const workerName = profile?.user?.name || user?.name || "Professional Worker";
  const workerPhone = profile?.user?.phone || user?.phone;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Worker Profile"
        subtitle="Manage your professional biography, service trades, project gallery, and verified credentials."
      />

      {/* Top Profile Summary Banner */}
      <div className="bg-surface border border-border rounded-md p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar
            src={profile?.profile_photo}
            name={workerName}
            size="lg"
            className="border-2 border-primary/20"
          />

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-xl font-bold text-ink truncate">
                {workerName}
              </h2>
              <Badge status="ACCEPTED" size="sm" dot>
                Verified Provider
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap">
              {workerPhone && <span>{workerPhone}</span>}
              {profile?.experience_years !== undefined && (
                <span>• {profile.experience_years} Years Experience</span>
              )}
            </div>
          </div>
        </div>

        {profile?.payment_rate && (
          <div className="flex flex-col items-start sm:items-end p-3 bg-surface-alt/50 rounded-sm border border-border shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Base Hourly Rate
            </span>
            <PriceDisplay amount={profile.payment_rate} size="lg" />
          </div>
        )}
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden border-b border-border flex overflow-x-auto gap-1 pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-xs"
                : "text-ink-secondary hover:text-ink hover:bg-surface-alt"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile View: Render Active Tab Only */}
      <div className="md:hidden">
        {activeTab === "basic" && <BasicInfoSection profile={profile} />}
        {activeTab === "services" && (
          <ServiceCategoriesSection services={profile?.services} />
        )}
        {activeTab === "portfolio" && (
          <PortfolioSection portfolios={profile?.portfolios} />
        )}
        {activeTab === "certificates" && (
          <CertificatesSection certificates={profile?.certificates} />
        )}
        {activeTab === "verification" && (
          <VerificationSection profile={profile} user={user || undefined} />
        )}
      </div>

      {/* Desktop View: Stacked Full Management Sections */}
      <div className="hidden md:flex flex-col gap-6">
        <BasicInfoSection profile={profile} />
        <ServiceCategoriesSection services={profile?.services} />
        <PortfolioSection portfolios={profile?.portfolios} />
        <CertificatesSection certificates={profile?.certificates} />
        <VerificationSection profile={profile} user={user || undefined} />
      </div>
    </div>
  );
}
