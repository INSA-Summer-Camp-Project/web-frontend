"use client";

import React, { useState } from "react";
import { WorkerCard } from "@/components/features/worker/WorkerCard";
import { useSearchWorkers, useCategories } from "@/hooks/useWorker";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Search, Users } from "lucide-react";
import type { WorkerSortBy } from "@/types";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<WorkerSortBy>("rating");

  // Simple debounce (normally we'd use a hook)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: categories = [] } = useCategories();

  const {
    data: rawWorkers,
    isLoading,
    isError,
    refetch,
  } = useSearchWorkers({
    search: debouncedSearch || undefined,
    categoryId: selectedCategory || undefined,
    sortBy,
  });

  const workers = Array.isArray(rawWorkers)
    ? rawWorkers
    : (rawWorkers as unknown as { data: typeof rawWorkers })?.data || [];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "jobs", label: "Most Jobs Done" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-md p-5 flex flex-col h-[280px]"
            >
              <div className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-5/6 mt-2" />
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <ErrorState
          title="Failed to load professionals"
          message="We encountered an issue fetching the marketplace data."
          onRetry={() => refetch()}
        />
      );
    }

    if (!workers?.length) {
      return (
        <EmptyState
          icon={<Users size={48} className="text-ink-muted/30" />}
          title="No professionals found"
          description="We couldn't find anyone matching your current filters. Try adjusting your search criteria."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink">
          Find Trusted Professionals
        </h1>
        <p className="text-lg text-ink-muted">
          Connect with verified specialists for home repairs, maintenance, and
          more.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-border rounded-md p-4 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by specialist name, bio, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-border rounded-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as WorkerSortBy)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div>{renderResults()}</div>
    </div>
  );
}
