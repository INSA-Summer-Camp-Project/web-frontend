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
  experienceYears?: number;
  experience_years?: number;
  paymentRate?: string | number;
  payment_rate?: string | number;
  ratingAvg?: string | number;
  rating_avg?: string | number;
  profilePhoto?: string;
  profile_photo?: string;
  user?: Pick<
    UserProfile,
    "id" | "name" | "email" | "phone" | "avatarUrl" | "photoUrl"
  >;
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

export interface Review {
  id: string;
  workerId?: string;
  customerId?: string;
  jobId?: string;
  rating: number;
  comment?: string;
  reviewerRole?: "CUSTOMER_TO_WORKER" | "WORKER_TO_CUSTOMER" | string;
  customer?: {
    id?: string;
    name?: string;
    avatarUrl?: string;
    user?: {
      name?: string;
      photoUrl?: string;
    };
  };
  worker?: {
    id?: string;
    name?: string;
    avatarUrl?: string;
    user?: {
      name?: string;
      photoUrl?: string;
    };
  };
  job?: {
    id: string;
    title?: string;
    category?: {
      id: string;
      name: string;
    };
  };
  createdAt?: string;
}

export interface WorkerReputation {
  workerId: string;
  rating_avg: number;
  totalReviews: number;
  distribution: Record<string, number>;
  metrics: WorkerReputationMetrics;
  badges: string[];
  reviews?: Review[];
}

export interface WorkerSearchParams {
  categoryId?: string;
  search?: string;
  minRating?: number;
  minRate?: number;
  maxRate?: number;
  sortBy?: "rating" | "jobs" | "newest" | "rate_asc" | "rate_desc";
  page?: number;
  limit?: number;
}
