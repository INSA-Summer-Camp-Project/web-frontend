"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Simple role extraction from pathname for MVP purposes.
  // In a real app, you'd get this from your Auth context or session.
  const isWorker = pathname.startsWith("/worker");
  const userRole = isWorker ? "WORKER" : "CUSTOMER";

  // Mock user data for UI purposes.
  const user = {
    name: isWorker ? "Alex Worker" : "Sarah Customer",
    role: userRole,
  };

  return (
    <DashboardLayout userRole={userRole} user={user}>
      {children}
    </DashboardLayout>
  );
}
