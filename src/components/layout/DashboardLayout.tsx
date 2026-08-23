"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import type { UserProfile } from "@/types";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "CUSTOMER" | "WORKER";
  user?: UserProfile | null;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole = "CUSTOMER",
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar role={userRole} />

      {/* Mobile Sidebar */}
      <MobileNav
        role={userRole}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full lg:ml-64">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          user={user}
          userRole={userRole}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
