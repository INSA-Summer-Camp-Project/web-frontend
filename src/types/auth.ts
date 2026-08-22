export type SystemRole = "USER" | "ADMIN";
export type ActiveRole = "CUSTOMER" | "WORKER";
export type UserRole = "CUSTOMER" | "WORKER" | "ADMIN" | "USER";

export interface ProfileSnippet {
  id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CustomerProfileSnippet {
  id: string;
  bio?: string | null;
  ratingAvg?: number | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface WorkerSnippet {
  id: string;
  bio?: string | null;
  experienceYears?: number;
  ratingAvg?: number | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface User {
  id: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  telegramId?: string | null;
  systemRole?: SystemRole;
  lastActiveRole?: ActiveRole | null;
  customerProfile?: CustomerProfileSnippet | null;
  worker?: WorkerSnippet | null;
  workerProfile?: WorkerSnippet | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: ActiveRole;
  fullName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface RoleUpdatePayload {
  activeRole: ActiveRole;
}

export interface UserProfile {
  id: string;
  name?: string;
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  avatarUrl?: string | null;
  telegramId?: string | null;
  systemRole?: SystemRole;
  isOnboarded?: boolean;
  lastActiveRole?: ActiveRole | null;
  role?: UserRole; // for backward compatibility
  customerProfile?: CustomerProfileSnippet | null;
  worker?: WorkerSnippet | null;
  workerProfile?: WorkerSnippet | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: UserProfile;
}
