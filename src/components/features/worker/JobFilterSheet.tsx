"use client";

import React, { useEffect, useCallback } from "react";
import { X, Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryChip } from "@/components/ui/CategoryChip";
import type { JobCategory } from "@/types";

export interface JobFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
  onSearchChange: (query: string) => void;
  categories: JobCategory[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId?: string) => void;
  minBudget?: number | string;
  maxBudget?: number | string;
  onMinBudgetChange: (val: string) => void;
  onMaxBudgetChange: (val: string) => void;
  onReset: () => void;
  onApply: () => void;
  totalResultsCount?: number;
}

export const JobFilterSheet: React.FC<JobFilterSheetProps> = ({
  isOpen,
  onClose,
  searchQuery = "",
  onSearchChange,
  categories,
  selectedCategoryId,
  onCategorySelect,
  minBudget = "",
  maxBudget = "",
  onMinBudgetChange,
  onMaxBudgetChange,
  onReset,
  onApply,
  totalResultsCount,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
      className="fixed inset-0 z-layer-modal flex flex-col justify-end lg:hidden"
    >
      {/* Backdrop */}
      <div
        data-testid="filter-sheet-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div className="relative w-full max-h-[85vh] bg-surface rounded-t-xl shadow-lg border-t border-border flex flex-col z-10 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            <h2
              id="filter-sheet-title"
              className="font-serif text-lg font-bold text-ink"
            >
              Filter Jobs
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label
              htmlFor="sheet-search-input"
              className="text-xs font-bold uppercase tracking-wider text-ink-muted"
            >
              Search Keyword
            </label>
            <Input
              id="sheet-search-input"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              <CategoryChip
                label="All"
                size="sm"
                selected={!selectedCategoryId}
                onToggle={() => onCategorySelect(undefined)}
              />
              {categories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  label={cat.name}
                  size="sm"
                  selected={selectedCategoryId === cat.id}
                  onToggle={() =>
                    onCategorySelect(
                      selectedCategoryId === cat.id ? undefined : cat.id,
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
              Budget Range (ETB)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min ETB"
                value={minBudget}
                onChange={(e) => onMinBudgetChange(e.target.value)}
                min={0}
              />
              <Input
                type="number"
                placeholder="Max ETB"
                value={maxBudget}
                onChange={(e) => onMaxBudgetChange(e.target.value)}
                min={0}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-alt/40 flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={() => {
              onReset();
            }}
            leftIcon={<RotateCcw size={14} />}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            {totalResultsCount !== undefined
              ? `Show Results (${totalResultsCount})`
              : "Apply Filters"}
          </Button>
        </div>
      </div>
    </div>
  );
};
