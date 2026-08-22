"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  SlidersHorizontal,
  X,
  Briefcase,
  UserCheck,
  Tag,
  ArrowUpDown,
  ShieldCheck,
} from "lucide-react";
import { useSearchWorkers, useCategories } from "@/hooks/useWorker";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { DirectBookingModal } from "@/components/features/worker";
import type { WorkerProfile, WorkerSearchParams } from "@/types";

export default function CustomerWorkersDiscoveryPage() {
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");
  const [minRate, setMinRate] = useState<string>("");
  const [maxRate, setMaxRate] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "rating" | "jobs" | "newest" | "rate_asc" | "rate_desc"
  >("rating");

  // Booking Modal State
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] =
    useState<WorkerProfile | null>(null);

  // Query categories
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Search parameters for API
  const queryParams: WorkerSearchParams = useMemo(() => {
    const params: WorkerSearchParams = {
      sortBy,
      page: 1,
      limit: 30,
    };
    if (search.trim()) params.search = search.trim();
    if (selectedCategory) params.categoryId = selectedCategory;
    if (minRating) params.minRating = parseFloat(minRating);
    if (minRate && !isNaN(parseFloat(minRate)))
      params.minRate = parseFloat(minRate);
    if (maxRate && !isNaN(parseFloat(maxRate)))
      params.maxRate = parseFloat(maxRate);
    return params;
  }, [search, selectedCategory, minRating, minRate, maxRate, sortBy]);

  // Query workers
  const {
    data: workers,
    isLoading: workersLoading,
    error,
    refetch,
  } = useSearchWorkers(queryParams);

  const activeFiltersCount = [
    search.trim(),
    selectedCategory,
    minRating,
    minRate,
    maxRate,
    sortBy !== "rating",
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinRating("");
    setMinRate("");
    setMaxRate("");
    setSortBy("rating");
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-ink mb-2">
          Find Workers & Specialists
        </h1>
        <p className="text-ink-muted">
          Browse verified professionals, compare rates and ratings, and send
          direct hiring requests.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface p-5 rounded-sm border border-border space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by specialist name, skill, or keyword..."
              leftIcon={<Search size={16} />}
              rightIcon={
                search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                ) : undefined
              }
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: "", label: "All Categories" },
                ...(categories?.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })) ?? []),
              ]}
              disabled={categoriesLoading}
            />
          </div>

          {/* Sort By Dropdown */}
          <div>
            <Select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    "rating" | "jobs" | "newest" | "rate_asc" | "rate_desc",
                )
              }
              options={[
                { value: "rating", label: "Top Rated" },
                { value: "jobs", label: "Most Completed Jobs" },
                { value: "newest", label: "Newest First" },
                { value: "rate_asc", label: "Rate: Low to High" },
                { value: "rate_desc", label: "Rate: High to Low" },
              ]}
            />
          </div>
        </div>

        {/* Secondary Filter Row: Rating & Rate Ranges */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Filter by:
            </span>

            {/* Min Rating */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="bg-surface-alt border border-border text-ink text-xs font-medium rounded-sm px-3 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">Any Rating</option>
              <option value="4.5">★ 4.5 & up</option>
              <option value="4.0">★ 4.0 & up</option>
              <option value="3.5">★ 3.5 & up</option>
            </select>

            {/* Rate Range */}
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span>Rate (ETB):</span>
              <input
                type="number"
                placeholder="Min"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                className="w-18 bg-surface-alt border border-border text-ink text-xs font-medium rounded-sm px-2 py-1 focus:outline-none focus:border-primary"
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="w-18 bg-surface-alt border border-border text-ink text-xs font-medium rounded-sm px-2 py-1 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X size={12} /> Clear Filters ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Category Quick Chips Bar */}
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === ""
                ? "bg-primary text-white"
                : "bg-surface border border-border text-ink-secondary hover:text-ink hover:bg-surface-alt"
            }`}
          >
            All Specialists
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? "" : cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-ink-secondary hover:text-ink hover:bg-surface-alt"
                }`}
              >
                <Tag size={12} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Worker Discovery Grid */}
      <section>
        {workersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface p-6 rounded-sm border border-border space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between pt-2 border-t border-border">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message="Failed to load specialists. Please check your connection and try again."
            onRetry={refetch}
          />
        ) : !workers?.length ? (
          <EmptyState
            title="No specialists found"
            description={
              activeFiltersCount > 0
                ? "No specialists matched your current filter criteria. Try adjusting your keyword or rate range."
                : "No verified specialists are available at the moment."
            }
            icon={<SlidersHorizontal size={48} className="text-ink-muted/50" />}
            actionLabel={activeFiltersCount > 0 ? "Reset Filters" : undefined}
            onAction={activeFiltersCount > 0 ? handleResetFilters : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker: WorkerProfile) => {
              const rating = worker.ratingAvg;
              const rate = worker.paymentRate;
              const expYears = worker.experienceYears;

              return (
                <div
                  key={worker.id}
                  className="bg-surface rounded-sm border border-border p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Worker Profile Info */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <Avatar
                        src={
                          worker.profilePhoto ||
                          worker.user?.photoUrl ||
                          worker.user?.avatarUrl ||
                          undefined
                        }
                        name={worker.user?.name || "Professional"}
                        size="lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-ink text-base truncate">
                            {worker.user?.name || "Professional Specialist"}
                          </h3>
                          <span
                            title="Verified Professional"
                            className="text-primary shrink-0"
                          >
                            <ShieldCheck size={14} />
                          </span>
                        </div>

                        {/* Rating & Jobs */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted flex-wrap">
                          {rating ? (
                            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-xs">
                              <Star
                                size={11}
                                className="fill-amber-500 text-amber-500"
                              />
                              {Number(rating).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-ink-muted">
                              New specialist
                            </span>
                          )}

                          {expYears && <span>• {expYears} yrs exp.</span>}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-ink-secondary mb-4 line-clamp-3 leading-relaxed">
                      {worker.bio ||
                        "Experienced local specialist ready for residential and commercial service bookings."}
                    </p>

                    {/* Service Tags */}
                    {worker.services && worker.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {worker.services.slice(0, 3).map((srv) => (
                          <Badge
                            key={srv.id}
                            variant="default"
                            size="sm"
                            className="text-[11px]"
                          >
                            {srv.category?.name}
                          </Badge>
                        ))}
                        {worker.services.length > 3 && (
                          <span className="text-[11px] text-ink-muted self-center">
                            +{worker.services.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-4 border-t border-border flex items-center justify-between gap-2 mt-2">
                    <div>
                      <span className="text-[11px] text-ink-muted uppercase font-semibold block">
                        Hourly / Base Rate
                      </span>
                      <span className="text-base font-bold text-primary tabular-nums">
                        {rate
                          ? `${Number(rate).toLocaleString()} ETB`
                          : "Contact for Rate"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/worker/${worker.id}`}>
                        <Button variant="outline" size="sm">
                          Profile
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedWorkerForBooking(worker)}
                      >
                        Hire
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Direct Booking Modal */}
      {selectedWorkerForBooking && (
        <DirectBookingModal
          isOpen={!!selectedWorkerForBooking}
          onClose={() => setSelectedWorkerForBooking(null)}
          worker={selectedWorkerForBooking}
          defaultCategoryId={selectedCategory}
        />
      )}
    </div>
  );
}
