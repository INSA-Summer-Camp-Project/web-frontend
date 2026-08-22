import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { useUpdateJob, useCategories } from "@/hooks/useJobs";
import type { Job } from "@/types";

const editJobSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title too long"),
  description: z
    .string()
    .min(20, "Please provide a more detailed description (min 20 chars)")
    .max(2000, "Description too long"),
  budget: z
    .number({ message: "Budget is required" })
    .min(100, "Minimum budget is 100 ETB")
    .max(1000000, "Budget cannot exceed 1,000,000 ETB"),
  categoryId: z.string().min(1, "Please select a category"),
});

type EditJobFormData = z.infer<typeof editJobSchema>;

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export const EditJobModal: React.FC<EditJobModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const { data: categories } = useCategories();
  const { mutate: updateJob, isPending } = useUpdateJob(job.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditJobFormData>({
    resolver: zodResolver(editJobSchema),
    defaultValues: {
      title: job.title,
      description: job.description || "",
      budget: Number(job.budget),
      categoryId: job.categoryId,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: job.title,
        description: job.description || "",
        budget: Number(job.budget),
        categoryId: job.categoryId,
      });
    }
  }, [isOpen, job, reset]);

  const onSubmit = (data: EditJobFormData) => {
    updateJob(data, {
      onSuccess: () => {
        toast.success("Job updated successfully.");
        onClose();
      },
      onError: (err) => {
        toast.error(
          err instanceof Error ? err.message : "Failed to update job.",
        );
      },
    });
  };

  const categoryOptions =
    categories?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Job Posting"
      description="Update the details of your job posting. This is only possible while the job is still open."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <Input
          label="Job Title"
          placeholder="e.g. Need a plumber to fix a leaking sink"
          {...register("title")}
          error={errors.title?.message}
        />

        <Select
          label="Service Category"
          placeholder="Select the most relevant category"
          options={categoryOptions}
          {...register("categoryId")}
          error={errors.categoryId?.message}
        />

        <Textarea
          label="Job Description"
          placeholder="Describe the issue, requirements, and any specifics the professional should know..."
          rows={5}
          {...register("description")}
          error={errors.description?.message}
        />

        <Input
          label="Estimated Budget (ETB)"
          type="number"
          placeholder="e.g. 500"
          {...register("budget", { valueAsNumber: true })}
          error={errors.budget?.message}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
