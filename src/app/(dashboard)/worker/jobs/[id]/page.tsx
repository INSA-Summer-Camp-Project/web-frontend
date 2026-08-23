"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJob, useDirectRespond } from "@/hooks/useJobs";
import { useCreateProposal } from "@/hooks/useApplications";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Clock } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";
import { toast } from "@/components/ui/Toast";
import { DirectRespondPanel } from "@/components/features/worker/DirectRespondPanel";

export default function WorkerJobDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: job, isLoading: jobLoading, error: jobError } = useJob(id);
  const { mutate: createProposal, isPending: submitting } = useCreateProposal();
  const { mutate: directRespond, isPending: isResponding } =
    useDirectRespond(id);

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
    const trimmedTime = estimatedTime.trim();
    if (!parsedPrice || !trimmedTime) return;

    createProposal(
      { jobId: job.id, proposedPrice: parsedPrice, estimatedTime: trimmedTime },
      {
        onSuccess: () => {
          setBidModalOpen(false);
          router.push("/worker/jobs");
        },
      },
    );
  };

  const handleDirectRespond = (action: "ACCEPT" | "DECLINE") => {
    directRespond(
      { action },
      {
        onSuccess: () => {
          if (action === "ACCEPT") {
            toast.success(
              "Direct booking accepted! You are now assigned to this job.",
            );
          } else {
            toast.info("Direct booking declined.");
            router.push("/worker/jobs");
          }
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : `Failed to ${action.toLowerCase()} direct booking.`,
          );
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
            {job.status === "OPEN" && job.source !== "DIRECT" && (
              <Button size="lg" onClick={() => setBidModalOpen(true)}>
                Submit Proposal
              </Button>
            )}
          </div>
        </div>
      </div>

      {job.source === "DIRECT" && job.status === "PENDING" && (
        <DirectRespondPanel
          jobId={job.id}
          onRespond={handleDirectRespond}
          isLoading={isResponding}
        />
      )}

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
            label="Estimated Time"
            type="text"
            placeholder="e.g. 2 hours, 3 days"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            required
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
