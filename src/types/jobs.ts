import type { UserProfile } from "./auth";
import type { WorkerProfile } from "./worker";

export type JobStatus =
  | "OPEN"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "DECLINED"
  | "DISPUTED";

export type JobSource = "POSTING" | "DIRECT";

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  _count?: {
    workers?: number;
    jobs?: number;
  };
}

export interface Job {
  id: string;
  customerId: string;
  categoryId: string;
  title: string;
  description?: string;
  budget: string | number;
  source: JobSource;
  status: JobStatus;
  targetWorkerId?: string | null;
  assignedWorkerId?: string | null;
  category?: JobCategory;
  customer?: Pick<UserProfile, "id" | "name" | "email" | "phone">;
  assignedWorker?: WorkerProfile | null;
  targetWorker?: WorkerProfile | null;
  _count?: {
    applications?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface JobFilterParams {
  categoryId?: string;
  minBudget?: number;
  maxBudget?: number;
  q?: string;
  status?: JobStatus;
  page?: number;
  limit?: number;
}

export interface CreateJobPayload {
  categoryId: string;
  title: string;
  description: string;
  budget: number;
}

export interface CreateDirectJobPayload {
  targetWorkerId: string;
  categoryId: string;
  title: string;
  description: string;
  budget: number;
}

export interface DirectRespondPayload {
  action: "ACCEPT" | "DECLINE";
}

export interface UpdateJobStatusPayload {
  status: JobStatus;
}

export interface PaginatedJobsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedJobsResponse {
  data: Job[];
  meta: PaginatedJobsMeta;
}
