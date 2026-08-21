"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const response = await authApi.getMe();
        if (mounted) {
          setUser(response);
        }
      } catch {
        if (mounted) {
          clearAuth();
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [setUser, clearAuth]);

  return <>{children}</>;
};
