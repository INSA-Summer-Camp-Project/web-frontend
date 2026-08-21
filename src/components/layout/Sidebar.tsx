"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Wrench,
  Search,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";

export interface SidebarProps {
  role?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role: propRole,
  onLogout,
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

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // Proceed with local logout regardless of network errors
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bg-surface border-r border-border z-layer-sticky">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
            <Wrench size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-ink tracking-tight group-hover:text-primary transition-colors">
              ServiceHub
            </span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider -mt-1">
              {isWorker ? "Worker Portal" : "Customer Portal"}
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
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
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold transition-colors duration-150",
                isActive
                  ? "bg-primary-light text-primary border-l-4 border-primary pl-2.5 shadow-xs"
                  : "text-ink-secondary hover:bg-surface-alt hover:text-ink",
              )}
            >
              <Icon
                size={18}
                className={isActive ? "text-primary" : "text-ink-muted"}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-border bg-surface-alt/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 pr-1">
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
            title="Log out"
            aria-label="Log out"
            className="p-1.5 rounded-sm text-ink-muted hover:text-error hover:bg-error-light/50 transition-colors focus:outline-none cursor-pointer shrink-0 disabled:opacity-50"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
