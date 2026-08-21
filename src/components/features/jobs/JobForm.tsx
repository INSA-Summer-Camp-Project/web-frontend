"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateJob, useCategories } from "@/hooks/useJobs";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  budget: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount (e.g. 500.00)"),
});

type JobFormValues = z.infer<typeof jobSchema>;

export const JobForm = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const createJob = useCreateJob();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormValues) => {
    setSubmitError(null);
    try {
      await createJob.mutateAsync({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        budget: parseFloat(data.budget),
      });
      router.push("/customer/dashboard");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to create job. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-error/10 text-error rounded-sm flex items-center gap-2">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">
          Job Title
        </label>
        <Input
          {...register("title")}
          placeholder="e.g. Need a plumber for kitchen sink"
          className={errors.title ? "border-error" : ""}
        />
        {errors.title && (
          <p className="text-error text-xs mt-1.5">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={5}
          className={`w-full rounded-sm border bg-surface px-4 py-2 text-ink shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
            errors.description ? "border-error" : "border-border"
          }`}
          placeholder="Describe the job in detail..."
        />
        {errors.description && (
          <p className="text-error text-xs mt-1.5">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Category
          </label>
          <select
            {...register("categoryId")}
            className={`w-full rounded-sm border bg-surface px-4 h-[42px] text-ink shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
              errors.categoryId ? "border-error" : "border-border"
            }`}
            disabled={isLoadingCategories}
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-error text-xs mt-1.5">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Budget (ETB)
          </label>
          <Input
            {...register("budget")}
            placeholder="0.00"
            className={errors.budget ? "border-error" : ""}
          />
          {errors.budget && (
            <p className="text-error text-xs mt-1.5">{errors.budget.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/customer/dashboard")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting || createJob.isPending}
        >
          Post Job
        </Button>
      </div>
    </form>
  );
};
