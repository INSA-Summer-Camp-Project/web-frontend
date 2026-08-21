"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Briefcase,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCustomerJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/features/jobs/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { JobCardSkeleton } from "@/components/features/jobs/JobCardSkeleton";
import type { Job } from "@/types";

type JobTab = "ALL" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "DIRECT";

export default function CustomerJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<JobTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: jobs, isLoading, error, refetch } = useCustomerJobs();

  // Tab counts
  const tabCounts = useMemo(() => {
    if (!jobs)
      return { ALL: 0, OPEN: 0, IN_PROGRESS: 0, COMPLETED: 0, DIRECT: 0 };
    return {
      ALL: jobs.length,
      OPEN: jobs.filter((j) => j.status === "OPEN").length,
      IN_PROGRESS: jobs.filter((j) => j.status === "IN_PROGRESS").length,
      COMPLETED: jobs.filter((j) => j.status === "COMPLETED").length,
      DIRECT: jobs.filter((j) => j.source === "DIRECT").length,
    };
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    return jobs.filter((job: Job) => {
      // Filter by tab
      let matchesTab = true;
      if (activeTab === "OPEN") matchesTab = job.status === "OPEN";
      else if (activeTab === "IN_PROGRESS")
        matchesTab = job.status === "IN_PROGRESS";
      else if (activeTab === "COMPLETED")
        matchesTab = job.status === "COMPLETED";
      else if (activeTab === "DIRECT") matchesTab = job.source === "DIRECT";

      if (!matchesTab) return false;

      // Filter by search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDesc = job.description?.toLowerCase().includes(q) ?? false;
      const matchCategory =
        job.category?.name.toLowerCase().includes(q) ?? false;

      return matchTitle || matchDesc || matchCategory;
    });
  }, [jobs, activeTab, searchQuery]);

  const tabs: { key: JobTab; label: string }[] = [
    { key: "ALL", label: "All Jobs" },
    { key: "OPEN", label: "Open Requests" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "COMPLETED", label: "Completed" },
    { key: "DIRECT", label: "Direct Requests" },
  ];

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            My Jobs
          </h1>
          <p className="text-ink-muted">
            Manage your service requests, direct hiring requests, and review
            proposals.
          </p>
        </div>
        <Link href="/customer/jobs/new">
          <Button leftIcon={<PlusCircle size={18} />}>Post a Job</Button>
        </Link>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = tabCounts[tab.key];

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface text-ink-secondary hover:text-ink hover:bg-surface-alt border border-border"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-surface-alt text-ink-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              leftIcon={<Search size={16} />}
              rightIcon={
                searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-ink transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Job Grid or Status Message */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobCardSkeleton count={6} />
          </div>
        ) : error ? (
          <ErrorState
            message="Failed to load your jobs. Please try again."
            onRetry={refetch}
          />
        ) : !jobs?.length ? (
          <EmptyState
            title="No jobs posted yet"
            description="You haven't posted any service requests yet. Create your first job to start receiving bids from top professionals."
            icon={<Briefcase size={48} className="text-ink-muted/50" />}
            actionLabel="Post a Job"
            onAction={() => router.push("/customer/jobs/new")}
          />
        ) : !filteredJobs.length ? (
          <EmptyState
            title="No matching jobs found"
            description={
              searchQuery
                ? `No jobs matched your search "${searchQuery}". Try a different keyword or clear the search filter.`
                : "There are no jobs matching the selected filter."
            }
            icon={<SlidersHorizontal size={48} className="text-ink-muted/50" />}
            actionLabel={searchQuery ? "Clear Search" : "View All Jobs"}
            onAction={() => {
              setSearchQuery("");
              setActiveTab("ALL");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
