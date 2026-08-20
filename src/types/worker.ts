import type { UserProfile } from "./auth";

export interface WorkerCategory {
  id: string;
  name: string;
  description?: string;
}

export interface WorkerService {
  id: string;
  categoryId: string;
  workerId?: string;
  category: WorkerCategory;
}

export interface PortfolioItem {
  id: string;
  workerId?: string;
  title: string;
  description?: string;
  imageUrl: string;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  workerId?: string;
  title: string;
  fileUrl: string;
  file_url?: string;
  issuedDate?: string;
  issued_date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkerProfile {
  id: string;
  userId?: string;
  bio?: string;
  experience_years?: number;
  payment_rate?: string | number;
  rating_avg?: string | number;
  profile_photo?: string;
  user?: Pick<UserProfile, "id" | "name" | "email" | "phone">;
  services?: WorkerService[];
  portfolios?: PortfolioItem[];
  certificates?: Certificate[];
  _count?: {
    completedJobs?: number;
    reviews?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateWorkerProfilePayload {
  bio?: string;
  experience_years?: number;
  payment_rate?: number;
  profile_photo?: string;
}

export interface AddPortfolioPayload {
  title: string;
  description?: string;
  imageUrl: string;
}

export interface AddCertificatePayload {
  title: string;
  fileUrl: string;
  issuedDate?: string;
}

export interface AddServicePayload {
  categoryId: string;
}

export interface WorkerReputationMetrics {
  completedJobs: number;
  cancelledJobs: number;
  jobCompletionRate: number;
  repeatCustomers: number;
}

export interface WorkerReputation {
  workerId: string;
  rating_avg: number;
  totalReviews: number;
  distribution: Record<string, number>;
  metrics: WorkerReputationMetrics;
  badges: string[];
}
