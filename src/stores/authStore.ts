import { create } from "zustand";
import type { UserProfile, ActiveRole, UserRole } from "@/types";

export interface AuthState {
  user: UserProfile | null;
  activeRole: ActiveRole | UserRole | null;
  setUser: (user: UserProfile | null) => void;
  setActiveRole: (role: ActiveRole | UserRole | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activeRole: null,
  setUser: (user) =>
    set((state) => ({
      user,
      activeRole:
        user?.lastActiveRole || (user?.role as ActiveRole) || state.activeRole,
    })),
  setActiveRole: (activeRole) => set({ activeRole }),
  clearAuth: () => set({ user: null, activeRole: null }),
}));
