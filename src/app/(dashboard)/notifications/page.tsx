"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead 
} from "@/hooks/useNotifications";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { Bell, CheckCircle2, AlertCircle, Briefcase, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "SYSTEM_ALERT":
      return <AlertCircle size={20} className="text-warning" />;
    case "JOB_APPLICATION_RECEIVED":
    case "JOB_APPLICATION_ACCEPTED":
    case "JOB_APPLICATION_REJECTED":
      return <Briefcase size={20} className="text-primary" />;
    case "DIRECT_BOOKING_RECEIVED":
    case "DIRECT_BOOKING_ACCEPTED":
    case "DIRECT_BOOKING_DECLINED":
      return <MessageSquare size={20} className="text-accent" />;
    case "JOB_COMPLETED":
      return <CheckCircle2 size={20} className="text-success" />;
    case "NEW_REVIEW_RECEIVED":
      return <Star size={20} className="text-warning" />;
    default:
      return <Bell size={20} className="text-ink-muted" />;
  }
};

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Could not load notifications" 
          message="There was a problem connecting to the server. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const hasUnread = notifications?.some((n) => !n.isRead);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your jobs, applications, and account activity."
        actions={
          hasUnread ? (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              isLoading={markAllAsRead.isPending}
            >
              Mark all as read
            </Button>
          ) : null
        }
      />

      <div className="bg-surface border border-border rounded-md shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 flex gap-4 animate-pulse">
                <div className="w-10 h-10 bg-surface-alt rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-alt rounded-sm w-1/3" />
                  <div className="h-3 bg-surface-alt rounded-sm w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !notifications?.length ? (
          <div className="p-12">
            <EmptyState
              icon={<Bell size={48} className="text-ink-muted/30" />}
              title="No notifications yet"
              description="When you receive updates about your jobs or account, they will appear here."
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={cn(
                  "p-4 hover:bg-surface-alt/50 transition-colors flex gap-4 items-start",
                  !notification.isRead ? "bg-primary/5" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs",
                  !notification.isRead ? "bg-surface border-2 border-primary/20" : "bg-surface-alt border border-border"
                )}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={cn(
                      "text-sm", 
                      !notification.isRead ? "font-bold text-ink" : "font-semibold text-ink-secondary"
                    )}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-ink-muted whitespace-nowrap shrink-0">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className={cn(
                    "text-sm mt-1",
                    !notification.isRead ? "text-ink-secondary" : "text-ink-muted"
                  )}>
                    {notification.message}
                  </p>
                  
                  {!notification.isRead && (
                    <button 
                    type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs font-semibold text-primary mt-2 hover:underline"
                      disabled={markAsRead.isPending}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
