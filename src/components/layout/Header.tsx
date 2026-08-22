"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import type { UserProfile } from "@/types";

export interface HeaderProps {
  onMenuClick: () => void;
  user?: UserProfile | null;
  userRole?: "CUSTOMER" | "WORKER";
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  user: propUser,
  userRole: propUserRole,
}) => {
  const router = useRouter();
  const storeUser = useAuthStore((state) => state.user);
  const storeActiveRole = useAuthStore((state) => state.activeRole);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = propUser !== undefined ? propUser : storeUser;
  const activeRole =
    propUserRole ||
    (storeActiveRole as "CUSTOMER" | "WORKER") ||
    user?.lastActiveRole ||
    user?.role ||
    "CUSTOMER";

  const displayName = user?.name || user?.fullName || "User";
  const displayEmail = user?.email || "";
  const avatarSrc = user?.photoUrl || user?.avatarUrl || undefined;
  const basePath =
    activeRole.toLowerCase() === "worker" ? "/worker" : "/customer";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore network failure and clear local session anyway
    } finally {
      clearAuth();
      setDropdownOpen(false);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-layer-sticky h-16 bg-surface border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 mr-2 text-ink-secondary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:block text-lg font-bold font-serif text-ink">
          Dashboard
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell Component */}
        <NotificationBell />

        {/* User Profile Dropdown */}
        <div className="relative pl-4 border-l border-border" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-ink leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-ink-muted capitalize">
                {activeRole.toLowerCase()}
              </span>
            </div>
            <Avatar
              src={avatarSrc}
              name={displayName}
              size="md"
              className="ring-2 ring-transparent hover:ring-primary/40 ring-offset-1 transition-all"
            />
            <ChevronDown
              size={16}
              className={`text-ink-muted hidden sm:block transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-sm shadow-lg border border-border py-1.5 z-layer-modal animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-sm font-bold text-ink truncate">
                  {displayName}
                </p>
                {displayEmail && (
                  <p className="text-xs text-ink-muted truncate">
                    {displayEmail}
                  </p>
                )}
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-light text-primary">
                  {activeRole}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href={`${basePath}/profile`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-secondary hover:bg-surface-alt hover:text-ink transition-colors"
                >
                  <User size={16} className="text-ink-muted" />
                  Profile
                </Link>
                <Link
                  href={`${basePath}/settings`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-secondary hover:bg-surface-alt hover:text-ink transition-colors"
                >
                  <Settings size={16} className="text-ink-muted" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-semibold text-error hover:bg-error-light/50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <LogOut size={16} />
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
