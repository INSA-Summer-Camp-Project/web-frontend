import React from "react";
import { JobForm } from "@/components/features/jobs/JobForm";

export default function PostJobPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-ink mb-2">
          Post a Job
        </h1>
        <p className="text-ink-muted">
          Provide clear details to attract the best professionals for your
          request.
        </p>
      </div>

      <div className="bg-surface border border-border p-6 md:p-8 rounded-sm shadow-sm">
        <JobForm />
      </div>
    </div>
  );
}
