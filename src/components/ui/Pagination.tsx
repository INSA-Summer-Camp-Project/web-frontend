"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // current + siblings + first + last
    const totalBlocks = totalNumbers + 2; // + 2 for ellipses

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [1, "...", ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [1, "...", ...middleRange, "...", totalPages];
  };

  const pages = getPageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`inline-flex items-center gap-1 select-none ${className}`}
    >
      {/* Previous Button */}
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        aria-label="Go to previous page"
        className={`inline-flex items-center justify-center gap-1 min-w-[36px] h-9 px-2.5 rounded-sm border text-sm font-medium transition-colors ${
          isFirstPage
            ? "border-border bg-surface-alt/60 text-ink-muted/50 cursor-not-allowed"
            : "border-border-strong/60 bg-white text-ink hover:bg-surface-alt cursor-pointer shadow-xs"
        }`}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${idx}`}
                className="w-8 h-9 flex items-center justify-center text-xs text-ink-muted"
                aria-hidden="true"
              >
                •••
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${pageNumber}`}
              className={`min-w-[36px] h-9 px-2.5 rounded-sm text-sm font-semibold transition-colors cursor-pointer tabular-nums ${
                isActive
                  ? "bg-primary text-white border border-primary shadow-xs"
                  : "border border-border bg-white text-ink hover:bg-surface-alt"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={isLastPage}
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        aria-label="Go to next page"
        className={`inline-flex items-center justify-center gap-1 min-w-[36px] h-9 px-2.5 rounded-sm border text-sm font-medium transition-colors ${
          isLastPage
            ? "border-border bg-surface-alt/60 text-ink-muted/50 cursor-not-allowed"
            : "border-border-strong/60 bg-white text-ink hover:bg-surface-alt cursor-pointer shadow-xs"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};
