"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, CheckSquare, Bell, User } from "lucide-react";

export interface WorkerMobileNavProps {
  className?: string;
}

export const WorkerMobileNav: React.FC<WorkerMobileNavProps> = ({
  className = "",
}) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
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
      label: "Alerts",
      href: "/notifications",
      icon: <Bell size={20} />,
    },
    {
      label: "Profile",
      href: "/worker/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-layer-sticky bg-surface border-t border-border shadow-lg ${className}`}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
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
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors select-none ${
                isActive
                  ? "text-primary font-bold"
                  : "text-ink-muted hover:text-ink font-medium"
              }`}
            >
              <span
                className={
                  isActive ? "text-primary scale-105" : "text-ink-muted"
                }
              >
                {item.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
