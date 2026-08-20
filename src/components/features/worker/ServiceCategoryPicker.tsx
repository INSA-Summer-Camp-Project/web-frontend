"use client";

import React, { useState } from "react";
import { Plus, Check, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCategories } from "@/hooks/useWorker";
import type { WorkerCategory } from "@/types";

export interface ServiceCategoryPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryIds: string[];
  onSelectCategory: (categoryId: string) => Promise<void> | void;
  isLoading?: boolean;
}

export const ServiceCategoryPicker: React.FC<ServiceCategoryPickerProps> = ({
  isOpen,
  onClose,
  selectedCategoryIds,
  onSelectCategory,
  isLoading = false,
}) => {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [addingCategoryId, setAddingCategoryId] = useState<string | null>(null);

  const filteredCategories = categories.filter((cat: WorkerCategory) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAdd = async (categoryId: string) => {
    try {
      setAddingCategoryId(categoryId);
      await onSelectCategory(categoryId);
    } finally {
      setAddingCategoryId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Service Category"
      description="Choose services you provide so clients can find you for relevant job postings."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Search Filter */}
        <Input
          id="category-search"
          placeholder="Search categories (e.g. Plumbing, Electrician)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={16} />}
        />

        {/* Categories List */}
        {isCategoriesLoading ? (
          <div className="py-8 flex justify-center items-center">
            <Spinner size="md" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <p className="text-center py-6 text-xs text-ink-muted">
            No matching categories found.
          </p>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {filteredCategories.map((cat: WorkerCategory) => {
              const isSelected = selectedCategoryIds.includes(cat.id);
              const isBusy = addingCategoryId === cat.id || isLoading;

              return (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
                    isSelected
                      ? "bg-primary-light/30 border-primary/30"
                      : "bg-surface hover:bg-surface-alt border-border"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-sm font-semibold text-ink truncate">
                      {cat.name}
                    </span>
                    {cat.description && (
                      <span className="text-xs text-ink-muted line-clamp-1">
                        {cat.description}
                      </span>
                    )}
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary px-2.5 py-1 bg-surface rounded-sm border border-primary/20 shrink-0">
                      <Check size={14} /> Added
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAdd(cat.id)}
                      disabled={isBusy}
                      isLoading={addingCategoryId === cat.id}
                      leftIcon={<Plus size={14} />}
                    >
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-border flex justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
