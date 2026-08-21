"use client";

import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const activeRole = useAuthStore((state) => state.activeRole);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return {
    user,
    activeRole,
    isAuthenticated: !!user,
    logout: clearAuth,
  };
};

export default useAuth;
