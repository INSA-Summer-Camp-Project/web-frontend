import { create } from "zustand";
import type { UserProfile, UserRole } from "@/types";

export interface AuthState {
  user: UserProfile | null;
  activeRole: UserRole | null;
  setUser: (user: UserProfile | null) => void;
  setActiveRole: (role: UserRole | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activeRole: null,
  setUser: (user) =>
    set((state) => ({
      user,
      activeRole: user?.lastActiveRole || user?.role || state.activeRole,
    })),
  setActiveRole: (activeRole) => set({ activeRole }),
  clearAuth: () => set({ user: null, activeRole: null }),
}));
