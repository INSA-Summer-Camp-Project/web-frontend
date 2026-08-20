import type { JobStatus } from "@/types";
import type { Category } from "@/features/categories/types";

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  status: JobStatus;
  categoryId: string;
  category?: Category;
  ownerId: string;
  assignedWorkerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  categoryId: string;
  budget: string; // e.g. "500.00"
  targetWorkerId?: string;
}
