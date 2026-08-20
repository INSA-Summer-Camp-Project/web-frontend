"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { Filter, Search, RotateCcw } from "lucide-react";
import { useJobs, useCategories } from "@/hooks/useJobs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CategoryChip } from "@/components/ui/CategoryChip";
import {
  JobCard,
  JobCardSkeleton,
  JobFilterSidebar,
  JobFilterSheet,
} from "@/components/features/worker";

const PAGE_SIZE = 8;

export default function WorkerJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Fetch categories
  const { data: categories = [] } = useCategories();

  // Fetch jobs
  const {
    data: jobsResponse,
    isLoading,
    isError,
    refetch,
  } = useJobs({
    q: searchQuery.trim() || undefined,
    categoryId: selectedCategoryId || undefined,
    minBudget: minBudget ? Number(minBudget) : undefined,
    maxBudget: maxBudget ? Number(maxBudget) : undefined,
    status: "OPEN",
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const jobs = jobsResponse?.data || [];
  const meta = jobsResponse?.meta;
  const totalJobs = meta?.total ?? jobs.length;
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
        title="Find Jobs"
        subtitle="Browse customer job postings in your service category and submit competitive bids."
        badge={
          <Badge variant="default" size="md">
            {totalJobs} Open {totalJobs === 1 ? "Job" : "Jobs"}
          </Badge>
        }
      />

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
          {isError && (
            <ErrorState
              title="Unable to load job postings"
              message="There was an issue connecting to the server. Please verify your connection."
              onRetry={() => refetch()}
              retryLabel="Retry loading jobs"
            />
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <JobCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Empty Results State */}
          {!isLoading && !isError && jobs.length === 0 && (
            <EmptyState
              title="No jobs found"
              description={
                hasActiveFilters
                  ? "We couldn't find any job postings matching your current filter criteria."
                  : "There are currently no open job requests available. Please check back soon."
              }
              actionLabel={hasActiveFilters ? "Clear All Filters" : undefined}
              onAction={hasActiveFilters ? handleResetFilters : undefined}
            />
          )}

          {/* Jobs Grid */}
          {!isLoading && !isError && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !isError && totalPages > 1 && (
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
          refetch();
        }}
        totalResultsCount={totalJobs}
      />
    </div>
  );
}
