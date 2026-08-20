"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PortfolioUploadModal } from "./PortfolioUploadModal";
import { useAddPortfolio, useDeletePortfolio } from "@/hooks/useWorker";
import type { PortfolioItem, AddPortfolioPayload } from "@/types";

export interface PortfolioSectionProps {
  portfolios?: PortfolioItem[];
  className?: string;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  portfolios = [],
  className = "",
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);

  const addPortfolioMutation = useAddPortfolio();
  const deletePortfolioMutation = useDeletePortfolio();

  const handleAddPortfolio = async (payload: AddPortfolioPayload) => {
    try {
      await addPortfolioMutation.mutateAsync(payload);
      toast.success("Portfolio project added successfully!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add portfolio item.";
      toast.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deletePortfolioMutation.mutateAsync(itemToDelete.id);
      toast.success("Portfolio item removed.");
      setItemToDelete(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete portfolio item.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div
        className={`bg-surface border border-border rounded-md p-6 shadow-xs space-y-5 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">
              Work Portfolio & Project Gallery
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Highlight completed jobs and craftsmanship photos to win more
              clients.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Add Project
          </Button>
        </div>

        {portfolios.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border rounded-md bg-surface-alt/20 space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <ImageIcon size={20} />
            </div>
            <p className="text-sm font-semibold text-ink">
              No portfolio projects uploaded yet
            </p>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Photos of previous projects help clients verify your work quality
              and hire with confidence.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                leftIcon={<Plus size={14} />}
              >
                Upload First Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
            {portfolios.map((item) => {
              const imageUrl = item.imageUrl || item.image_url || "";
              return (
                <div
                  key={item.id}
                  className="group relative rounded-md border border-border bg-surface-alt overflow-hidden flex flex-col shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="relative aspect-4/3 w-full bg-surface-alt overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-muted">
                        <ImageIcon size={24} />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setItemToDelete(item)}
                        leftIcon={<Trash2 size={14} />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-surface border-t border-border flex flex-col justify-between flex-1">
                    <span className="text-sm font-bold text-ink truncate">
                      {item.title}
                    </span>
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
      </div>

      {/* Portfolio Upload Modal */}
      <PortfolioUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleAddPortfolio}
        isLoading={addPortfolioMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Delete Portfolio Item?"
        description="Are you sure you want to remove this project photo from your public profile?"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setItemToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              isLoading={deletePortfolioMutation.isPending}
              onClick={handleConfirmDelete}
            >
              Delete Item
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Item:{" "}
          <span className="font-semibold text-ink">{itemToDelete?.title}</span>
        </p>
      </Modal>
    </>
  );
};
