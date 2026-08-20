import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/authStore";
import type { UserProfile } from "@/types";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("initializes with null user and activeRole", () => {
    const { user, activeRole } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(activeRole).toBeNull();
  });

  it("sets user and derives activeRole from user.lastActiveRole", () => {
    const mockUser: UserProfile = {
      id: "usr-123",
      email: "test@example.com",
      role: "WORKER",
      lastActiveRole: "WORKER",
    };

    useAuthStore.getState().setUser(mockUser);

    const { user, activeRole } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(activeRole).toBe("WORKER");
  });

  it("sets user and derives activeRole from user.role fallback", () => {
    const mockUser: UserProfile = {
      id: "usr-123",
      email: "test@example.com",
      role: "CUSTOMER",
    };

    useAuthStore.getState().setUser(mockUser);

    const { user, activeRole } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(activeRole).toBe("CUSTOMER");
  });

  it("allows setting activeRole independently", () => {
    useAuthStore.getState().setActiveRole("WORKER");
    expect(useAuthStore.getState().activeRole).toBe("WORKER");

    useAuthStore.getState().setActiveRole("CUSTOMER");
    expect(useAuthStore.getState().activeRole).toBe("CUSTOMER");
  });

  it("clears auth properly", () => {
    useAuthStore.getState().setUser({
      id: "usr-123",
      email: "test@example.com",
      role: "WORKER",
    });
    expect(useAuthStore.getState().user).not.toBeNull();
    expect(useAuthStore.getState().activeRole).toBe("WORKER");

    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().activeRole).toBeNull();
  });
});
