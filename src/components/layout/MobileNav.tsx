"use client";

import React, { useEffect } from "react";
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  role,
  isOpen,
  onClose,
}) => {
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

  // Close on route change
  useEffect(() => {
    if (!isOpen) return;
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
              <Wrench size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-serif text-xl font-semibold text-ink tracking-tight">
              ServiceHub
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 -mr-2 text-ink-muted hover:text-ink transition-colors"
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

        <div className="p-4 border-t border-border">
          <button className="flex w-full items-center gap-3 px-3 py-3 rounded-sm text-sm font-semibold text-error hover:bg-error-light transition-colors duration-150">
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};
