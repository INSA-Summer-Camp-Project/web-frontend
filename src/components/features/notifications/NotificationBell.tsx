"use client";

import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import { useAuthStore } from "@/stores/authStore";

export const NotificationBell: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  // Only fetch if user is logged in
  const { data } = useUnreadNotificationCount();

  const unreadCount = data?.count || 0;

  if (!user) return null;

  return (
    <Link
      href="/notifications"
      className="relative p-2 text-ink-muted hover:text-primary transition-colors rounded-full hover:bg-surface-alt"
      aria-label="View notifications"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white shadow-xs">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
};
