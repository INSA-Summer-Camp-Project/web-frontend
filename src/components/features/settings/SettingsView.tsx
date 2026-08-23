"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "@/components/ui/Toast";
import { Shield, UserCircle, RefreshCcw } from "lucide-react";
import type { RoleType } from "@/components/ui/RoleSelector";
import type { ApiError } from "@/lib/api";

export const SettingsView = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeRole = useAuthStore((state) => state.activeRole);
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: (newRole: "CUSTOMER" | "WORKER") => authApi.updateRole(newRole),
    onSuccess: (updatedUser, newRole) => {
      setUser(updatedUser);
      document.cookie = `servicehub_active_role=${newRole}; path=/; max-age=2592000; SameSite=Lax`;
      toast.success(`Successfully switched to ${newRole.toLowerCase()} mode`);
      router.push(`/${newRole.toLowerCase()}/dashboard`);
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to switch role");
    },
  });

  if (!user || !activeRole) return null;

  const handleRoleSwitch = () => {
    const newRole: RoleType = activeRole === "CUSTOMER" ? "WORKER" : "CUSTOMER";
    updateRole(newRole);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account modes."
      />

      {/* Account Info */}
      <section className="bg-surface border border-border rounded-md p-6 shadow-xs">
        <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2 mb-4">
          <UserCircle size={20} className="text-primary" />
          Profile Information
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar
            src={user.photoUrl || user.avatarUrl}
            name={user.name || "User"}
            size="xl"
          />
          <div className="space-y-1 flex-1">
            <h4 className="font-semibold text-ink text-lg">{user.name}</h4>
            {user.telegramId && (
              <div className="pt-2 flex items-center gap-2 text-xs text-ink-muted">
                <Shield size={14} className="text-success-text" />
                <span>Verified via Telegram</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Role Switching */}
      <section className="bg-surface border border-border rounded-md p-6 shadow-xs">
        <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2 mb-4">
          <RefreshCcw size={20} className="text-primary" />
          Account Mode
        </h3>
        <p className="text-sm text-ink-secondary mb-6">
          You are currently using ServiceHub as a <strong>{activeRole}</strong>.
          You can switch modes at any time to hire help or offer your own
          services.
        </p>

        <div className="bg-surface-alt p-4 rounded-sm border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="block text-sm font-semibold text-ink">
              Switch to {activeRole === "CUSTOMER" ? "Worker" : "Customer"} Mode
            </span>
            <span className="block text-xs text-ink-muted mt-0.5">
              Access your{" "}
              {activeRole === "CUSTOMER" ? "service provider" : "hiring"}{" "}
              dashboard.
            </span>
          </div>
          <Button
            variant="outline"
            onClick={handleRoleSwitch}
            isLoading={isUpdatingRole}
          >
            Switch Role
          </Button>
        </div>
      </section>
    </div>
  );
};
