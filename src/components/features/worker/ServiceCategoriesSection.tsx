"use client";

import React, { useState } from "react";
import { Plus, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { Button } from "@/components/ui/Button";
import { ServiceCategoryPicker } from "./ServiceCategoryPicker";
import {
  useWorkerServices,
  useAddWorkerService,
  useRemoveWorkerService,
} from "@/hooks/useWorker";
import type { WorkerService } from "@/types";

export interface ServiceCategoriesSectionProps {
  services?: WorkerService[];
  className?: string;
}

export const ServiceCategoriesSection: React.FC<
  ServiceCategoriesSectionProps
> = ({ services: initialServices, className = "" }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { data: fetchedServices, isLoading: isServicesLoading } =
    useWorkerServices();
  const addServiceMutation = useAddWorkerService();
  const removeServiceMutation = useRemoveWorkerService();

  const services = fetchedServices || initialServices || [];
  const selectedCategoryIds = services.map(
    (s) => s.categoryId || s.category?.id,
  );

  const handleAddCategory = async (categoryId: string) => {
    try {
      await addServiceMutation.mutateAsync({ categoryId });
      toast.success("Service category added!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add service category.";
      toast.error(errorMessage);
    }
  };

  const handleRemoveCategory = async (service: WorkerService) => {
    try {
      const serviceId = service.id;
      if (!serviceId) return;
      await removeServiceMutation.mutateAsync(serviceId);
      toast.success("Service category removed.");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to remove service category.";
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
              Service Categories
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Specify all trade disciplines you specialize in to receive matched
              job requests.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsPickerOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Add Category
          </Button>
        </div>

        {/* Chips list */}
        {services.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border rounded-md bg-surface-alt/20 space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <Layers size={20} />
            </div>
            <p className="text-sm font-semibold text-ink">
              No service categories added yet
            </p>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Add at least one category so clients can discover your profile and
              invite you to tasks.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsPickerOpen(true)}
                leftIcon={<Plus size={14} />}
              >
                Add Your First Category
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {services.map((service) => (
              <CategoryChip
                key={service.id || service.categoryId}
                label={service.category?.name || "Service"}
                selected={true}
                onRemove={() => handleRemoveCategory(service)}
                disabled={removeServiceMutation.isPending || isServicesLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Category Picker Modal */}
      <ServiceCategoryPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedCategoryIds={selectedCategoryIds}
        onSelectCategory={handleAddCategory}
        isLoading={addServiceMutation.isPending}
      />
    </>
  );
};
