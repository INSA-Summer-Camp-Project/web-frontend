"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  CheckSquare,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Logo } from "@/components/ui/Logo";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export interface WorkerSidebarProps {
  className?: string;
  onLogout?: () => void;
}

export const WorkerSidebar: React.FC<WorkerSidebarProps> = ({
  className = "",
  onLogout,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/worker/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Find Jobs",
      href: "/worker/jobs",
      icon: <Search size={20} />,
    },
    {
      label: "My Work",
      href: "/worker/jobs?tab=my_work",
      icon: <CheckSquare size={20} />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Bell size={20} />,
    },
    {
      label: "Profile",
      href: "/worker/profile",
      icon: <User size={20} />,
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <aside
      className={`hidden lg:flex flex-col w-[260px] shrink-0 bg-surface border-r border-border min-h-screen sticky top-0 z-layer-sticky ${className}`}
    >
      {/* Brand Logo Header */}
      <div className="h-16 px-6 flex items-center border-b border-border">
        <Logo
          variant="blue"
          size={36}
          href="/worker/dashboard"
          subtitle="Worker Portal"
        />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/worker/dashboard" && item.href.includes("?")
              ? pathname === item.href.split("?")[0]
              : pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between h-11 px-3.5 rounded-sm text-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? "bg-primary-light text-primary border-l-4 border-primary pl-2.5 shadow-xs"
                  : "text-ink-secondary hover:bg-surface-alt hover:text-ink"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-primary" : "text-ink-muted"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Profile & Logout */}
      <div className="p-4 border-t border-border bg-surface-alt/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
              {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "W"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-ink truncate">
                {user?.name || "Worker Account"}
              </span>
              <span className="text-[11px] text-ink-muted truncate">
                {user?.email || "Pro Provider"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="p-1.5 rounded-sm text-ink-muted hover:text-error hover:bg-error-light/50 transition-colors focus:outline-none cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
