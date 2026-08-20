import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/stores/uiStore";

describe("uiStore", () => {
  beforeEach(() => {
    useUIStore.getState().setMobileNavOpen(false);
  });

  it("initializes with isMobileNavOpen as false", () => {
    expect(useUIStore.getState().isMobileNavOpen).toBe(false);
  });

  it("toggles mobile nav state", () => {
    useUIStore.getState().toggleMobileNav();
    expect(useUIStore.getState().isMobileNavOpen).toBe(true);

    useUIStore.getState().toggleMobileNav();
    expect(useUIStore.getState().isMobileNavOpen).toBe(false);
  });

  it("sets mobile nav state explicitly", () => {
    useUIStore.getState().setMobileNavOpen(true);
    expect(useUIStore.getState().isMobileNavOpen).toBe(true);

    useUIStore.getState().setMobileNavOpen(false);
    expect(useUIStore.getState().isMobileNavOpen).toBe(false);
  });
});
