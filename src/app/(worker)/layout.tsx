"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
