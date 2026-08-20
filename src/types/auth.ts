export type UserRole = "CUSTOMER" | "WORKER" | "BUSINESS" | "ADMIN";

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
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
  refreshToken: string;
}

export interface RoleUpdatePayload {
  activeRole: UserRole;
}

export interface UserProfile {
  id: string;
  email: string;
  role?: UserRole;
  systemRole?: string;
  lastActiveRole?: UserRole;
  fullName?: string;
  name?: string;
  phone?: string;
  customerProfile?: { id: string } | null;
  workerProfile?: { id: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: UserProfile;
}
