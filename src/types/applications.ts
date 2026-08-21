import type { Job } from "./jobs";
import type { WorkerProfile } from "./worker";

export type ApplicationStatus =
  "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  proposedPrice: number | string;
  estimatedTime: string;
  status: ApplicationStatus;
  job?: Job;
  worker?: WorkerProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyPayload {
  proposedPrice: number;
  estimatedTime: string | number;
}

export interface AcceptApplicationResponse {
  application?: Application;
  job?: Job;
  message?: string;
  jobId?: string;
  assignedWorkerId?: string;
  agreedBudget?: string | number;
  status?: string;
}
