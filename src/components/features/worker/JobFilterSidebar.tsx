import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryChip } from "@/components/ui/CategoryChip";
import type { JobCategory } from "@/types";

export interface JobFilterSidebarProps {
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
  className?: string;
}

export const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({
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
  className = "",
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategoryId) ||
    Boolean(minBudget) ||
    Boolean(maxBudget);

  return (
    <aside
      aria-label="Job filters"
      className={`bg-surface border border-border rounded-md p-5 shadow-xs space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-primary" />
          <h2 className="font-serif text-base font-bold text-ink">
            Filter Jobs
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-primary transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label
          htmlFor="job-search-input"
          className="text-xs font-bold uppercase tracking-wider text-ink-muted"
        >
          Search Keyword
        </label>
        <Input
          id="job-search-input"
          placeholder="e.g. Plumbing, Wiring..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label="All Categories"
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

      {/* Budget Range Inputs */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
          Budget Range (ETB)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="number"
              placeholder="Min ETB"
              value={minBudget}
              onChange={(e) => onMinBudgetChange(e.target.value)}
              min={0}
            />
          </div>
          <div>
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

      {/* Reset CTA Button */}
      {hasActiveFilters && (
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={onReset}
          leftIcon={<RotateCcw size={14} />}
        >
          Clear All Filters
        </Button>
      )}
    </aside>
  );
};
