"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJob } from "@/features/jobs/hooks";
import { useCreateProposal } from "@/features/proposals/hooks";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Clock } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function WorkerJobDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: job, isLoading: jobLoading, error: jobError } = useJob(id);
  const { mutate: createProposal, isPending: submitting } = useCreateProposal();

  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  if (jobLoading) {
    return <div className="p-8 text-ink-muted">Loading job details...</div>;
  }

  if (jobError || !job) {
    return (
      <div className="p-8">
        <ErrorState
          message="Could not load job details."
          onRetry={() => router.push("/worker/jobs")}
          retryLabel="Back to Job Board"
        />
      </div>
    );
  }

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    const parsedTime = parseInt(estimatedTime, 10);
    if (!parsedPrice || !parsedTime) return;

    createProposal(
      { jobId: job.id, proposedPrice: parsedPrice, estimatedTime: parsedTime },
      {
        onSuccess: () => {
          setBidModalOpen(false);
          router.push("/worker/jobs");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-ink-muted hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Jobs
        </button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink mb-3">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge variant={job.status === "OPEN" ? "success" : "default"}>
                {job.status}
              </Badge>
              <span className="flex items-center gap-1 text-ink-muted">
                <Clock size={14} /> Posted{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <div className="bg-surface-alt px-6 py-4 rounded-sm border border-border flex flex-col items-end">
              <span className="block text-sm text-ink-muted mb-1 font-semibold uppercase tracking-wider">
                Client Budget
              </span>
              <span className="text-2xl font-bold text-ink tabular-nums">
                {job.budget} ETB
              </span>
            </div>
            {job.status === "OPEN" && (
              <Button size="lg" onClick={() => setBidModalOpen(true)}>
                Submit Proposal
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="bg-surface p-6 rounded-sm border border-border">
        <h2 className="text-lg font-bold text-ink mb-4">Job Description</h2>
        <p className="text-ink-secondary whitespace-pre-wrap leading-relaxed">
          {job.description}
        </p>
      </section>

      {/* Proposal Modal */}
      <Modal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        title="Submit a Proposal"
        description={`You are bidding on: ${job.title}`}
        maxWidth="lg"
      >
        <form
          onSubmit={handleSubmitProposal}
          className="flex flex-col gap-6 mt-4"
        >
          <Input
            label="Your Bid Amount (ETB)"
            type="number"
            placeholder="e.g. 500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="1"
          />

          <Input
            label="Estimated Time (minutes)"
            type="number"
            placeholder="e.g. 120 for 2 hours"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            required
            min="1"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setBidModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Submit Proposal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
