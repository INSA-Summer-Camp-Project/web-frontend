"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
  user: {
    name: string;
    role: string;
    avatarUrl?: string | null;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, user }) => {
  return (
    <header className="sticky top-0 z-layer-sticky h-16 bg-surface border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 mr-2 text-ink-secondary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:block text-lg font-bold font-serif text-ink">
          Dashboard
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-ink-secondary hover:text-primary transition-colors focus:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-primary">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-ink leading-tight">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-ink-muted capitalize">
              {user?.role?.toLowerCase() || "Guest"}
            </span>
          </div>
          <Link href={`/${user?.role?.toLowerCase() || "customer"}/profile`}>
            <Avatar
              src={user?.avatarUrl}
              name={user?.name || "User"}
              size="md"
              className="cursor-pointer hover:ring-2 ring-primary ring-offset-2 transition-all"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
