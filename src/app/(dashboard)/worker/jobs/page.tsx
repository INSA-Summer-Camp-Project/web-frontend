"use client";

export const dynamic = "force-dynamic";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Filter,
  Search,
  RotateCcw,
  Briefcase,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useJobs, useCategories, useWorkerJobs } from "@/hooks/useJobs";
import { useMyApplications } from "@/hooks/useApplications";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  JobCard,
  JobCardSkeleton,
  JobFilterSidebar,
  JobFilterSheet,
} from "@/components/features/worker";

const PAGE_SIZE = 8;

function WorkerJobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab =
    searchParams.get("tab") === "my_work" ? "my_work" : "browse";
  const isMyWork = activeTab === "my_work";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Fetch categories (only for browse)
  const { data: categories = [] } = useCategories(!isMyWork);

  // Fetch marketplace jobs (only enabled when in browse tab)
  const {
    data: jobsResponse,
    isLoading: isJobsLoading,
    isError: isJobsError,
    refetch: refetchJobs,
  } = useJobs(
    {
      q: searchQuery.trim() || undefined,
      categoryId: selectedCategoryId || undefined,
      minBudget: minBudget ? Number(minBudget) : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      page: currentPage,
      limit: PAGE_SIZE,
    },
    !isMyWork,
  );

  // Fetch worker's assigned jobs and applications (only enabled when in my_work tab)
  const {
    data: workerJobs = [],
    isLoading: isWorkerJobsLoading,
    isError: isWorkerJobsError,
    refetch: refetchWorkerJobs,
  } = useWorkerJobs(isMyWork);

  const {
    data: myApplications = [],
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    refetch: refetchApplications,
  } = useMyApplications(isMyWork);

  const marketplaceJobs = jobsResponse?.data || [];
  const meta = jobsResponse?.meta;
  const totalJobs = meta?.total ?? marketplaceJobs.length;
  const totalPages = meta?.totalPages ?? 1;

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategoryId) ||
    Boolean(minBudget) ||
    Boolean(maxBudget);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedCategoryId ? 1 : 0) +
    (minBudget || maxBudget ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId(undefined);
    setMinBudget("");
    setMaxBudget("");
    setCurrentPage(1);
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={isMyWork ? "My Work & Proposals" : "Find Jobs"}
        subtitle={
          isMyWork
            ? "Track your hired contracts, active jobs, and submitted proposals."
            : "Browse customer job postings in your service category and submit competitive bids."
        }
        badge={
          !isMyWork ? (
            <Badge variant="default" size="md">
              {totalJobs} Open {totalJobs === 1 ? "Job" : "Jobs"}
            </Badge>
          ) : undefined
        }
      />

      {/* Top Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => router.push("/worker/jobs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-1 transition-colors cursor-pointer ${
            !isMyWork
              ? "border-primary text-primary"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <Search size={16} />
          <span>Find Jobs</span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/worker/jobs?tab=my_work")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-1 transition-colors cursor-pointer ${
            isMyWork
              ? "border-primary text-primary"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <Briefcase size={16} />
          <span>My Work</span>
          {myApplications.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-bold">
              {myApplications.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT: MY WORK */}
      {isMyWork && (
        <div className="space-y-8">
          {/* Active Assigned Jobs Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-ink">
                  Assigned Contracts & Jobs
                </h2>
                <p className="text-xs text-ink-muted">
                  Jobs where you are currently hired or recently completed
                </p>
              </div>
              <Badge variant="primary" size="sm">
                {workerJobs.length} Active
              </Badge>
            </div>

            {isWorkerJobsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-40 rounded-md" />
                <Skeleton className="h-40 rounded-md" />
              </div>
            ) : isWorkerJobsError ? (
              <ErrorState
                title="Failed to load assigned jobs"
                message="Unable to fetch your assigned jobs."
                onRetry={() => refetchWorkerJobs()}
              />
            ) : workerJobs.length === 0 ? (
              <div className="bg-surface border border-border rounded-md p-6">
                <EmptyState
                  title="No assigned jobs yet"
                  description="Submit competitive proposals or accept direct hire requests to start working."
                  actionButton={
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push("/worker/jobs")}
                    >
                      Browse Marketplace
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workerJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-surface border border-border rounded-md p-5 flex flex-col justify-between gap-4 hover:border-primary/40 transition-colors shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge status={job.status} size="sm" dot />
                        {job.category && (
                          <span className="text-xs font-semibold text-ink-muted">
                            {job.category.name}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/worker/jobs/${job.id}`}
                        className="font-serif text-base font-bold text-ink hover:text-primary transition-colors block"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-ink-secondary line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <div>
                        <span className="text-[11px] text-ink-muted font-bold uppercase block">
                          Budget
                        </span>
                        <span className="font-bold text-primary text-sm">
                          {job.budget} ETB
                        </span>
                      </div>
                      <Link href={`/worker/jobs/${job.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={<ArrowRight size={14} />}
                        >
                          View Contract
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submitted Applications / Proposals Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-ink">
                  My Proposals & Bids
                </h2>
                <p className="text-xs text-ink-muted">
                  Proposals submitted to customer postings
                </p>
              </div>
              <Badge variant="default" size="sm">
                {myApplications.length} Total
              </Badge>
            </div>

            {isApplicationsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 rounded-md" />
                <Skeleton className="h-20 rounded-md" />
              </div>
            ) : isApplicationsError ? (
              <ErrorState
                title="Failed to load applications"
                message="Unable to fetch your submitted proposals."
                onRetry={() => refetchApplications()}
              />
            ) : myApplications.length === 0 ? (
              <div className="bg-surface border border-border rounded-md p-6">
                <EmptyState
                  title="No proposals submitted"
                  description="Explore open jobs and send proposals to win projects."
                  actionButton={
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push("/worker/jobs")}
                    >
                      Find Jobs to Bid On
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-md divide-y divide-border shadow-xs overflow-hidden">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-alt/40 transition-colors"
                  >
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/worker/jobs/${app.jobId}`}
                          className="font-serif text-sm md:text-base font-bold text-ink hover:text-primary transition-colors truncate"
                        >
                          {app.job?.title ||
                            `Job Application #${app.id.substring(0, 8)}`}
                        </Link>
                        <Badge status={app.status} size="sm" dot />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-ink-muted flex-wrap">
                        {app.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            <span>Est. {app.estimatedTime}</span>
                          </span>
                        )}
                        {app.job?.category && (
                          <span>Category: {app.job.category.name}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] uppercase font-bold text-ink-muted block">
                          Bid Amount
                        </span>
                        <PriceDisplay amount={app.proposedPrice} size="sm" />
                      </div>

                      <Link href={`/worker/jobs/${app.jobId}`}>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB CONTENT: BROWSE MARKETPLACE */}
      {!isMyWork && (
        <>
          {/* Mobile Search & Filter Trigger Bar */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search open jobs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<Search size={16} />}
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsFilterSheetOpen(true)}
              leftIcon={<Filter size={16} />}
              className="relative shrink-0"
            >
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center -mr-1">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Main Content Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Desktop Filter Sidebar */}
            <JobFilterSidebar
              className="hidden lg:block w-72 shrink-0 sticky top-20"
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={(id) => {
                setSelectedCategoryId(id);
                setCurrentPage(1);
              }}
              minBudget={minBudget}
              maxBudget={maxBudget}
              onMinBudgetChange={(val) => {
                setMinBudget(val);
                setCurrentPage(1);
              }}
              onMaxBudgetChange={(val) => {
                setMaxBudget(val);
                setCurrentPage(1);
              }}
              onReset={handleResetFilters}
            />

            {/* Results Area */}
            <div className="flex-1 w-full space-y-4">
              {/* Active filter chips summary */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap p-3 rounded-md bg-surface border border-border">
                  <span className="text-xs font-bold text-ink-muted">
                    Active filters:
                  </span>

                  {searchQuery && (
                    <CategoryChip
                      size="sm"
                      label={`"${searchQuery}"`}
                      selected
                      onRemove={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                    />
                  )}

                  {selectedCategory && (
                    <CategoryChip
                      size="sm"
                      label={selectedCategory.name}
                      selected
                      onRemove={() => {
                        setSelectedCategoryId(undefined);
                        setCurrentPage(1);
                      }}
                    />
                  )}

                  {(minBudget || maxBudget) && (
                    <CategoryChip
                      size="sm"
                      label={`ETB ${minBudget || "0"} - ${maxBudget || "∞"}`}
                      selected
                      onRemove={() => {
                        setMinBudget("");
                        setMaxBudget("");
                        setCurrentPage(1);
                      }}
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-primary hover:text-primary-dark ml-auto flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Clear All</span>
                  </button>
                </div>
              )}

              {/* Error State */}
              {isJobsError && (
                <ErrorState
                  title="Unable to load job postings"
                  message="There was an issue connecting to the server. Please verify your connection."
                  onRetry={() => refetchJobs()}
                  retryLabel="Retry loading jobs"
                />
              )}

              {/* Loading Skeletons */}
              {isJobsLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <JobCardSkeleton key={idx} />
                  ))}
                </div>
              )}

              {/* Empty Results State */}
              {!isJobsLoading &&
                !isJobsError &&
                marketplaceJobs.length === 0 && (
                  <EmptyState
                    title="No jobs found"
                    description={
                      hasActiveFilters
                        ? "We couldn't find any job postings matching your current filter criteria."
                        : "There are currently no open job requests available. Please check back soon."
                    }
                    actionLabel={
                      hasActiveFilters ? "Clear All Filters" : undefined
                    }
                    onAction={hasActiveFilters ? handleResetFilters : undefined}
                  />
                )}

              {/* Jobs Grid */}
              {!isJobsLoading && !isJobsError && marketplaceJobs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketplaceJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {!isJobsLoading && !isJobsError && totalPages > 1 && (
                <div className="flex justify-center pt-6 pb-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Drawer Filter Sheet */}
          <JobFilterSheet
            isOpen={isFilterSheetOpen}
            onClose={() => setIsFilterSheetOpen(false)}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={(id) => {
              setSelectedCategoryId(id);
              setCurrentPage(1);
            }}
            minBudget={minBudget}
            maxBudget={maxBudget}
            onMinBudgetChange={(val) => {
              setMinBudget(val);
              setCurrentPage(1);
            }}
            onMaxBudgetChange={(val) => {
              setMaxBudget(val);
              setCurrentPage(1);
            }}
            onReset={handleResetFilters}
            onApply={() => {
              setCurrentPage(1);
              refetchJobs();
            }}
            totalResultsCount={totalJobs}
          />
        </>
      )}
    </div>
  );
}

export default function WorkerJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40 rounded-md" />
            <Skeleton className="h-40 rounded-md" />
          </div>
        </div>
      }
    >
      <WorkerJobsContent />
    </Suspense>
  );
}
