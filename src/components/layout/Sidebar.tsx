"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Wrench,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const isCustomer = role.toUpperCase() === "CUSTOMER";
  const isWorker = role.toUpperCase() === "WORKER";

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

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bg-surface border-r border-border z-layer-sticky">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
            <Wrench size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-serif text-xl font-semibold text-ink tracking-tight group-hover:text-primary transition-colors">
            ServiceHub
          </span>
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

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold text-error hover:bg-error-light transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-error">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
};
