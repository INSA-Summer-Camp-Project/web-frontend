"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkerCard } from "@/components/features/worker/WorkerCard";
import { useSearchWorkers, useCategories } from "@/hooks/useWorker";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Search, SlidersHorizontal, Users } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce"; // Need to create this or just use local state

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  // Simple debounce (normally we'd use a hook)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: categories = [] } = useCategories();

  const {
    data: workers,
    isLoading,
    isError,
    refetch,
  } = useSearchWorkers({
    search: debouncedSearch || undefined,
    categoryId: selectedCategory || undefined,
    sortBy: sortBy as any,
  });

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "jobs", label: "Most Jobs Done" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink">
          Find Trusted Professionals
        </h1>
        <p className="text-lg text-ink-muted">
          Browse our marketplace of verified local workers ready to help with
          your next project.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface p-4 rounded-md border border-border shadow-xs flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-ink-muted" />
          </div>
          <input
            type="text"
            placeholder="Search by name or skills..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-ink"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex w-full md:w-auto gap-4">
          <div className="w-full md:w-48">
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
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        {isLoading ? (
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
        ) : isError ? (
          <ErrorState
            title="Failed to load professionals"
            message="We encountered an issue fetching the marketplace data."
            onRetry={() => refetch()}
          />
        ) : !workers?.length ? (
          <EmptyState
            icon={<Users size={48} className="text-ink-muted/30" />}
            title="No professionals found"
            description="We couldn't find anyone matching your current filters. Try adjusting your search criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
