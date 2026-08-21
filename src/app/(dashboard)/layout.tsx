"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const activeRole = useAuthStore((state) => state.activeRole);

  const isWorkerRoute = pathname.startsWith("/worker");
  const userRole = isWorkerRoute
    ? "WORKER"
    : activeRole === "WORKER"
      ? "WORKER"
      : "CUSTOMER";

  return (
    <DashboardLayout userRole={userRole} user={user}>
      {children}
    </DashboardLayout>
  );
}
