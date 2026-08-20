"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJob } from "@/features/jobs/hooks";
import { useJobProposals, useAcceptProposal } from "@/features/proposals/hooks";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function CustomerJobDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: job, isLoading: jobLoading, error: jobError } = useJob(id);
  const { data: proposals, isLoading: proposalsLoading } = useJobProposals(id);
  const { mutate: acceptProposal, isPending: accepting } = useAcceptProposal();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    null,
  );

  if (jobLoading) {
    return <div className="p-8 text-ink-muted">Loading job details...</div>;
  }

  if (jobError || !job) {
    return (
      <div className="p-8">
        <ErrorState
          message="Could not load job details."
          onRetry={() => router.push("/customer/dashboard")}
          retryLabel="Back to Dashboard"
        />
      </div>
    );
  }

  const handleAccept = (proposalId: string) => {
    setSelectedProposalId(proposalId);
    setConfirmModalOpen(true);
  };

  const confirmAccept = () => {
    if (selectedProposalId) {
      acceptProposal(selectedProposalId, {
        onSuccess: () => {
          setConfirmModalOpen(false);
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-ink-muted hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Dashboard
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
          <div className="bg-surface-alt px-6 py-4 rounded-sm border border-border shrink-0">
            <span className="block text-sm text-ink-muted mb-1 font-semibold uppercase tracking-wider">
              Budget
            </span>
            <span className="text-2xl font-bold text-primary tabular-nums">
              {job.budget} ETB
            </span>
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

      {/* Proposals */}
      <section className="space-y-6">
        <h2 className="text-xl font-serif font-bold text-ink">
          Proposals {proposals ? `(${proposals.length})` : ""}
        </h2>

        {proposalsLoading ? (
          <div className="text-ink-muted">Loading proposals...</div>
        ) : !proposals?.length ? (
          <div className="p-8 text-center bg-surface border border-border border-dashed rounded-sm text-ink-muted">
            No proposals yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-surface p-6 rounded-sm border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Worker Info */}
                  <div className="flex gap-4">
                    <Avatar
                      src={proposal.worker?.user?.avatarUrl ?? undefined}
                      name={proposal.worker?.user?.name || ""}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-bold text-ink text-lg">
                        {proposal.worker?.user?.name ?? "Worker"}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-ink-muted">
                        <Clock size={14} />
                        <span>{proposal.estimatedTime} min estimated</span>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Action */}
                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <span className="text-xl font-bold text-ink tabular-nums">
                      {proposal.proposedPrice.toLocaleString()} ETB
                    </span>
                    {job.status === "OPEN" ? (
                      <Button
                        onClick={() => handleAccept(proposal.id)}
                        size="sm"
                      >
                        Accept Bid
                      </Button>
                    ) : proposal.status === "ACCEPTED" ? (
                      <Badge
                        variant="success"
                        leftIcon={<CheckCircle size={14} />}
                      >
                        Accepted Bid
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm text-ink-muted">
                    <span className="font-semibold text-ink">
                      Estimated time:
                    </span>{" "}
                    {proposal.estimatedTime} minutes
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Accept Proposal"
        description="Are you sure you want to accept this bid? The job will be assigned to this professional."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmAccept}
            isLoading={accepting}
          >
            Confirm & Accept
          </Button>
        </div>
      </Modal>
    </div>
  );
}
