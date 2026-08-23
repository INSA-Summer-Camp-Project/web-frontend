"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Clock, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ApplyPayload } from "@/types";

const applySchema = z.object({
  proposedPrice: z
    .number({ message: "Please enter a valid amount" })
    .positive("Proposed price must be greater than 0"),
  estimatedTime: z
    .string()
    .min(1, "Please enter an estimated timeline (e.g. 2 hours, 3 days)"),
});

type ApplyFormValues = z.infer<typeof applySchema>;

export interface ApplyFormProps {
  jobId: string;
  defaultBudget?: number | string;
  onSubmit: (data: ApplyPayload) => void | Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  className?: string;
}

export const ApplyForm: React.FC<ApplyFormProps> = ({
  defaultBudget,
  onSubmit,
  isLoading = false,
  onCancel,
  className = "",
}) => {
  const initialBudget =
    typeof defaultBudget === "number"
      ? defaultBudget
      : defaultBudget
        ? parseFloat(defaultBudget)
        : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      proposedPrice:
        initialBudget && !isNaN(initialBudget) ? initialBudget : undefined,
      estimatedTime: "",
    },
  });

  const handleFormSubmit = async (values: ApplyFormValues) => {
    await onSubmit({
      proposedPrice: values.proposedPrice,
      estimatedTime: values.estimatedTime,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`bg-surface border border-border rounded-md p-6 shadow-xs space-y-5 ${className}`}
    >
      <div className="border-b border-border pb-3">
        <h2 className="font-serif text-lg font-bold text-ink">
          Submit Your Proposal
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Specify your rate and estimated delivery timeline for this job.
        </p>
      </div>

      <div className="space-y-4">
        {/* Proposed Price Field */}
        <div>
          <Input
            id="proposedPrice"
            type="number"
            step="any"
            label="Your Proposed Bid (ETB)"
            placeholder="e.g. 500"
            error={errors.proposedPrice?.message}
            leftIcon={<DollarSign size={16} />}
            {...register("proposedPrice", { valueAsNumber: true })}
          />
        </div>

        {/* Estimated Time Field */}
        <div>
          <Input
            id="estimatedTime"
            type="text"
            label="Estimated Time"
            placeholder="e.g. 2 hours, 3 days"
            error={errors.estimatedTime?.message}
            leftIcon={<Clock size={16} />}
            {...register("estimatedTime")}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          leftIcon={<Send size={16} />}
        >
          Submit Proposal
        </Button>
      </div>
    </form>
  );
};
