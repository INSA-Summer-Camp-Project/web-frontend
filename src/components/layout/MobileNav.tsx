"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";

export interface MobileNavProps {
  role?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  role: propRole,
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeRole = useAuthStore((state) => state.activeRole);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentRole = (
    propRole ||
    activeRole ||
    (pathname.startsWith("/worker") ? "WORKER" : "CUSTOMER")
  ).toUpperCase();

  const isCustomer = currentRole === "CUSTOMER";
  const isWorker = currentRole === "WORKER";

  const basePath = isCustomer ? "/customer" : "/worker";

  const customerLinks = [
    { name: "Dashboard", href: `${basePath}/dashboard`, icon: LayoutDashboard },
    { name: "My Jobs", href: `${basePath}/jobs`, icon: Briefcase },
    { name: "Find Workers", href: `${basePath}/workers`, icon: Search },
    { name: "Profile", href: `${basePath}/profile`, icon: User },
    { name: "Settings", href: `${basePath}/settings`, icon: Settings },
  ];

  const workerLinks = [
    { name: "Dashboard", href: `${basePath}/dashboard`, icon: LayoutDashboard },
    { name: "Available Jobs", href: `${basePath}/jobs`, icon: Search },
    { name: "My Proposals", href: `${basePath}/proposals`, icon: Briefcase },
    { name: "Profile", href: `${basePath}/profile`, icon: User },
    { name: "Settings", href: `${basePath}/settings`, icon: Settings },
  ];

  const links = isCustomer ? customerLinks : isWorker ? workerLinks : [];

  const displayName =
    user?.name || user?.fullName || (isWorker ? "Worker" : "Customer");
  const displayEmail = user?.email || "";
  const avatarSrc = user?.photoUrl || user?.avatarUrl || undefined;

  // Close on route change
  useEffect(() => {
    if (!isOpen) return;
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuth();
      onClose();
      router.push("/login");
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-layer-modal bg-ink/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-surface z-layer-critical flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Logo variant="blue" size={32} href="/" />
          <button
            onClick={onClose}
            className="p-1 -mr-2 text-ink-muted hover:text-ink transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-semibold transition-colors duration-150",
                  isActive
                    ? "bg-primary-light text-primary-dark"
                    : "text-ink-secondary hover:bg-surface-alt hover:text-ink",
                )}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-primary-dark" : "text-ink-muted"}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border bg-surface-alt/30 space-y-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              src={avatarSrc}
              name={displayName}
              size="sm"
              className="shrink-0 ring-1 ring-border"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-ink truncate leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] text-ink-muted truncate">
                {displayEmail ||
                  (isWorker ? "Worker Account" : "Customer Account")}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold text-error hover:bg-error-light transition-colors duration-150 disabled:opacity-50 cursor-pointer"
          >
            <LogOut size={18} />
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </aside>
    </>
  );
};
