"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { axiosInstance, ApiError } from "@/lib/api";
import { authApi } from "@/lib/api/auth";
import type {
  UserProfile,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from "@/types";

const ACCESS_TOKEN_KEY = "servicehub_access_token";
const REFRESH_TOKEN_KEY = "servicehub_refresh_token";

export interface AuthContextType {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to persist tokens in localStorage
  const saveTokens = useCallback((newTokens: AuthTokens | null) => {
    setTokens(newTokens);
    if (typeof window !== "undefined") {
      if (newTokens) {
        localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refreshToken);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveTokens(null);
    delete axiosInstance.defaults.headers.common["Authorization"];
  }, [saveTokens]);

  const refreshSession = useCallback(async () => {
    let currentRefreshToken: string | null = tokens?.refreshToken || null;
    if (!currentRefreshToken && typeof window !== "undefined") {
      currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    if (!currentRefreshToken) {
      logout();
      return;
    }

    try {
      const newTokens = await authApi.refreshToken(currentRefreshToken);
      const currentAccessToken = newTokens.accessToken;
      saveTokens(newTokens);
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${currentAccessToken}`;

      const profile = await authApi.getMe(currentAccessToken);
      setUser(profile);
    } catch {
      logout();
    }
  }, [tokens?.refreshToken, saveTokens, logout]);

  // Initial load: verify session from stored tokens
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (storedAccess && storedRefresh) {
        const storedTokens: AuthTokens = {
          accessToken: storedAccess,
          refreshToken: storedRefresh,
        };
        setTokens(storedTokens);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${storedAccess}`;

        try {
          const profile = await authApi.getMe(storedAccess);
          setUser(profile);
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            await refreshSession();
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [logout, refreshSession]);

  const login = useCallback(
    async (credentials: LoginPayload) => {
      setIsLoading(true);
      try {
        const authData = await authApi.login(credentials);
        saveTokens(authData.tokens);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${authData.tokens.accessToken}`;

        if (authData.user) {
          setUser(authData.user);
        } else {
          const profile = await authApi.getMe(authData.tokens.accessToken);
          setUser(profile);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [saveTokens],
  );

  const register = useCallback(
    async (data: RegisterPayload) => {
      setIsLoading(true);
      try {
        const authData = await authApi.register(data);
        saveTokens(authData.tokens);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${authData.tokens.accessToken}`;

        if (authData.user) {
          setUser(authData.user);
        } else {
          const profile = await authApi.getMe(authData.tokens.accessToken);
          setUser(profile);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [saveTokens],
  );

  const value = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, tokens, isLoading, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
