export type UserRole = "CUSTOMER" | "WORKER" | "BUSINESS";

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

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: UserProfile;
}
