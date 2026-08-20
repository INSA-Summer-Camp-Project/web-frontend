"use client";

import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { WorkerSidebar } from "./WorkerSidebar";
import { WorkerMobileNav } from "./WorkerMobileNav";
import { useAuthStore } from "@/stores/authStore";

export interface DashboardShellProps {
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  headerActions,
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen flex bg-background text-ink antialiased">
      {/* Desktop Navigation Sidebar */}
      <WorkerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-14 bg-surface border-b border-border px-4 flex items-center justify-between sticky top-0 z-layer-sticky">
          <Link href="/worker/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
              <Wrench size={16} className="stroke-[2.5]" />
            </div>
            <span className="font-serif text-base font-bold text-ink tracking-tight">
              ServiceHub
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {headerActions}
            <Link
              href="/worker/profile"
              className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs border border-primary/20"
              aria-label="View Profile"
            >
              {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "W"}
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <WorkerMobileNav />
      </div>
    </div>
  );
};
