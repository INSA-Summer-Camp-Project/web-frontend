"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, DollarSign } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { useCreateDirectJob, useCategories } from "@/hooks/useJobs";
import type { WorkerProfile } from "@/types";

const directBookingSchema = z.object({
  categoryId: z.string().min(1, "Please select a service category"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.coerce.number().positive("Budget must be a positive number"),
});

type DirectBookingInput = z.input<typeof directBookingSchema>;
type DirectBookingValues = z.infer<typeof directBookingSchema>;

export interface DirectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: WorkerProfile;
  defaultCategoryId?: string;
}

export const DirectBookingModal: React.FC<DirectBookingModalProps> = ({
  isOpen,
  onClose,
  worker,
  defaultCategoryId,
}) => {
  const router = useRouter();
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();
  const { mutate: createDirectJob, isPending: isSubmitting } =
    useCreateDirectJob();

  const workerName = worker.user?.name || "Professional Worker";
  const workerRate = Number(worker.payment_rate || worker.paymentRate || 350);

  // Pre-select category if available from worker services or defaultCategoryId
  const initialCategory =
    defaultCategoryId ||
    (worker.services && worker.services.length > 0
      ? worker.services[0].categoryId
      : "");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DirectBookingInput, unknown, DirectBookingValues>({
    resolver: zodResolver(directBookingSchema),
    defaultValues: {
      categoryId: initialCategory,
      title: "",
      description: "",
      budget: workerRate * 2, // Default 2 hours of worker base rate
    },
  });

  useEffect(() => {
    if (isOpen) {
      const selected =
        defaultCategoryId ||
        (worker.services && worker.services.length > 0
          ? worker.services[0].categoryId
          : "");
      setValue("categoryId", selected);
    }
  }, [isOpen, defaultCategoryId, worker.services, setValue]);

  const onSubmit = (data: DirectBookingValues) => {
    createDirectJob(
      {
        targetWorkerId: worker.id,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        budget: Number(data.budget),
      },
      {
        onSuccess: () => {
          toast.success(
            `Direct booking request sent to ${workerName.split(" ")[0]}!`,
          );
          reset();
          onClose();
          router.push("/customer/jobs");
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to send direct booking request. Please try again.",
          );
        },
      },
    );
  };

  // Build category options: prioritize worker's specialized services
  const categoryOptions = React.useMemo(() => {
    if (worker.services && worker.services.length > 0) {
      return [
        { value: "", label: "Select a service category..." },
        ...worker.services.map((srv) => ({
          value: srv.categoryId,
          label: `${srv.category.name} (Specialty)`,
        })),
        ...(allCategories
          ?.filter(
            (c) => !worker.services?.some((ws) => ws.categoryId === c.id),
          )
          .map((c) => ({
            value: c.id,
            label: c.name,
          })) ?? []),
      ];
    }

    return [
      { value: "", label: "Select a service category..." },
      ...(allCategories?.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? []),
    ];
  }, [worker.services, allCategories]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hire ${workerName}`}
      description={`Send a direct service request to ${workerName}. Once accepted, you can coordinate schedule and delivery.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {/* Worker Rate Callout */}
        <div className="bg-surface-alt border border-border p-3.5 rounded-sm flex items-center justify-between text-xs">
          <span className="text-ink-secondary">
            Specialist Rate:{" "}
            <strong className="text-ink">
              {Number(workerRate).toLocaleString()} ETB / hr
            </strong>
          </span>
          <span className="text-success-text font-semibold">
            Escrow Protected
          </span>
        </div>

        {/* Category Field */}
        <div>
          <Select
            label="Service Category"
            options={categoryOptions}
            disabled={categoriesLoading}
            error={errors.categoryId?.message}
            {...register("categoryId")}
          />
        </div>

        {/* Job Title Field */}
        <div>
          <Input
            label="Task / Project Title"
            placeholder="e.g. Repair kitchen sink pipe and faucet"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        {/* Description Field */}
        <div>
          <Textarea
            label="Detailed Description"
            placeholder="Describe the job, location context, tools needed, and your desired completion timeline (min. 20 characters)..."
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        {/* Proposed Budget Field */}
        <div>
          <Input
            label="Proposed Total Budget (ETB)"
            type="number"
            placeholder="e.g. 800"
            leftIcon={<DollarSign size={16} />}
            helperText="The total amount you are offering for this direct booking."
            error={errors.budget?.message}
            {...register("budget")}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Send size={16} />}
          >
            Send Direct Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
