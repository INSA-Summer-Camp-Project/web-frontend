"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  CheckCircle,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  usePublicWorkerProfile,
  useWorkerReputation,
  useWorkerReviews,
} from "@/hooks/useWorker";
import { Navbar } from "@/components/features/landing/Navbar";
import { Footer } from "@/components/features/landing/Footer";
import {
  WorkerProfileHeader,
  TrustSignalRow,
  ReviewCard,
  ReputationSummary,
  DirectBookingModal,
} from "@/components/features/worker";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Modal } from "@/components/ui/Modal";
import type { PortfolioItem } from "@/types";

export default function PublicWorkerProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const workerId = params?.id || "";

  const { isAuthenticated } = useAuth();
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch,
  } = usePublicWorkerProfile(workerId);

  const { data: reputation } = useWorkerReputation(workerId, !!profile);
  const { data: reviews } = useWorkerReviews(workerId, !!profile);

  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const handleHireClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/worker/view/${workerId}`);
      return;
    }
    setIsHireModalOpen(true);
  };

  if (isProfileError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <ErrorState
            title="Worker Profile Not Found"
            message="The requested service provider profile could not be located or may have been deactivated."
            onRetry={() => refetch()}
          />
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft size={16} />
              <span>Return to Home</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isProfileLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main
          className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6"
          data-testid="public-profile-skeleton"
        >
          {/* Back link skeleton */}
          <Skeleton width={120} height={20} />

          {/* Header Card Skeleton */}
          <div className="bg-surface border border-border rounded-md p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Skeleton variant="circular" width={96} height={96} />
            <div className="space-y-3 flex-1">
              <Skeleton width={220} height={32} />
              <Skeleton width={160} height={20} />
              <div className="flex gap-2">
                <Skeleton width={80} height={24} />
                <Skeleton width={90} height={24} />
              </div>
            </div>
            <Skeleton width={140} height={44} />
          </div>

          {/* Trust Row Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton height={88} />
            <Skeleton height={88} />
            <Skeleton height={88} />
            <Skeleton height={88} />
          </div>

          {/* Body Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton height={200} />
              <Skeleton height={250} />
            </div>
            <div className="space-y-6">
              <Skeleton height={220} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const workerName = profile.user?.name || "Professional Worker";
  const services = profile.services || [];
  const portfolios = profile.portfolios || [];
  const certificates = profile.certificates || [];
  const reviewList = reviews || reputation?.reviews || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-primary transition-colors group"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back to Marketplace</span>
        </Link>

        {/* Public Profile Header */}
        <WorkerProfileHeader
          profile={profile}
          reputation={reputation}
          onDirectRequest={handleHireClick}
        />

        {/* Trust Signals Metric Tiles */}
        <TrustSignalRow profile={profile} reputation={reputation} />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Left Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Offered Section */}
            <section className="bg-surface border border-border rounded-md p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Layers size={18} className="text-primary" />
                <h2 className="font-serif text-lg font-bold text-ink">
                  Offered Services & Expertise
                </h2>
              </div>

              {services.length === 0 ? (
                <p className="text-sm text-ink-muted italic">
                  No specific category specialties listed.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {services.map((service) => (
                    <span
                      key={service.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      <Sparkles size={12} />
                      <span>{service.category.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Work Portfolio Gallery Section */}
            <section className="bg-surface border border-border rounded-md p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Briefcase size={18} className="text-primary" />
                <h2 className="font-serif text-lg font-bold text-ink">
                  Featured Work & Portfolio
                </h2>
              </div>

              {portfolios.length === 0 ? (
                <p className="text-sm text-ink-muted italic">
                  No portfolio images uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolios.map((item) => {
                    const imgUrl = item.imageUrl || item.image_url || "";
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedPortfolio(item)}
                        className="group relative border border-border rounded-sm overflow-hidden bg-surface-alt cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <div className="aspect-4/3 relative overflow-hidden">
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-alt text-ink-muted">
                              <Briefcase size={32} />
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-surface">
                          <h3 className="text-sm font-bold text-ink truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-ink-muted line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Certifications Section */}
            {certificates.length > 0 && (
              <section className="bg-surface border border-border rounded-md p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <Award size={18} className="text-primary" />
                  <h2 className="font-serif text-lg font-bold text-ink">
                    Verified Certifications & Licenses
                  </h2>
                </div>

                <div className="divide-y divide-border">
                  {certificates.map((cert) => {
                    const fileUrl = cert.fileUrl || cert.file_url || "";
                    return (
                      <div
                        key={cert.id}
                        className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-success-light text-success-text flex items-center justify-center shrink-0">
                            <ShieldCheck size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-ink">
                              {cert.title}
                            </h3>
                            {cert.issuedDate && (
                              <span className="text-xs text-ink-muted">
                                Issued:{" "}
                                {new Date(cert.issuedDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
                          >
                            <span>View Document</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Reputation Breakdown */}
            {reputation && <ReputationSummary reputation={reputation} />}

            {/* Customer Reviews List */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-xl font-bold text-ink">
                  Customer Reviews ({reviewList.length})
                </h2>
              </div>

              {reviewList.length === 0 ? (
                <div className="bg-surface border border-border rounded-md p-8 text-center space-y-2">
                  <p className="text-sm font-medium text-ink-secondary">
                    No customer reviews yet
                  </p>
                  <p className="text-xs text-ink-muted">
                    Be the first client to book and review {workerName}!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewList.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sticky Sidebar Direct Booking Card */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-surface border border-border rounded-md p-6 shadow-md space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Service Rate
                </span>
                <PriceDisplay
                  amount={profile.payment_rate || 350}
                  size="xl"
                  period="/ hour"
                />
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border text-xs text-ink-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success-text" />
                  <span>Direct booking confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success-text" />
                  <span>Escrow payment protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-success-text" />
                  <span>Verified identity and credentials</span>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleHireClick}
                leftIcon={<MessageSquare size={16} />}
                className="w-full"
              >
                Hire {workerName.split(" ")[0]}
              </Button>

              <div className="text-center">
                <span className="text-[11px] text-ink-muted">
                  No upfront charge until job terms are agreed upon.
                </span>
              </div>
            </div>

            {/* Guarantee Badge Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-md p-4 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
                <ShieldCheck size={16} />
                <span>ServiceHub Trust & Safety Guarantee</span>
              </div>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                All bookings are backed by our dispute resolution team and
                satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Portfolio Lightbox Modal */}
      {selectedPortfolio && (
        <Modal
          isOpen={!!selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
          title={selectedPortfolio.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="aspect-4/3 relative rounded-sm overflow-hidden bg-black/5">
              {selectedPortfolio.imageUrl || selectedPortfolio.image_url ? (
                <Image
                  src={
                    selectedPortfolio.imageUrl ||
                    selectedPortfolio.image_url ||
                    ""
                  }
                  alt={selectedPortfolio.title}
                  fill
                  className="object-contain"
                />
              ) : null}
            </div>
            {selectedPortfolio.description && (
              <p className="text-sm text-ink-secondary leading-relaxed whitespace-pre-line">
                {selectedPortfolio.description}
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* Direct Booking Modal */}
      {profile && (
        <DirectBookingModal
          isOpen={isHireModalOpen}
          onClose={() => setIsHireModalOpen(false)}
          worker={profile}
        />
      )}

      <Footer />
    </div>
  );
}
