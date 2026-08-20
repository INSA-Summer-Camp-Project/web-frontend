export type SystemRole = "CUSTOMER" | "WORKER" | "ADMIN";

export interface ProfileSnippet {
  id: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  photoUrl?: string;
  lastActiveRole?: SystemRole;
  customerProfile?: ProfileSnippet | null;
  workerProfile?: ProfileSnippet | null;
  adminProfile?: ProfileSnippet | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: SystemRole;
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
  activeRole: SystemRole;
}

export interface UserProfile {
  id: string;
  email: string;
  role: SystemRole;
  lastActiveRole?: SystemRole;
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
