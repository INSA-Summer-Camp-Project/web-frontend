import type { Job } from "./jobs";
import type { WorkerProfile } from "./worker";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  proposedPrice: string | number;
  estimatedTime: string | number;
  status: ApplicationStatus;
  job?: Job;
  worker?: WorkerProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyPayload {
  proposedPrice: number;
  estimatedTime: number;
}

export interface AcceptApplicationResponse {
  message: string;
  jobId: string;
  assignedWorkerId: string;
  agreedBudget: string | number;
  status: string;
}
