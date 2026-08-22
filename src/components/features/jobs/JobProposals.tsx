import React, { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { Users, Clock, Check, X, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { useAcceptApplication, useRejectApplication } from "@/hooks/useApplications";
import { jobKeys } from "@/hooks/useJobs";
import type { Application } from "@/types";

interface JobProposalsProps {
  jobId: string;
  isOpen: boolean;
  proposals?: Application[];
  isLoading: boolean;
  refetchProposals: () => void;
}

export const JobProposals: React.FC<JobProposalsProps> = ({
  jobId,
  isOpen,
  proposals,
  isLoading,
  refetchProposals,
}) => {
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState<Application | null>(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const { mutate: acceptApplication, isPending: isAccepting } = useAcceptApplication(jobId);
  const { mutate: rejectApplication, isPending: isRejecting } = useRejectApplication(jobId);

  const handleOpenAccept = (proposal: Application) => {
    setSelectedProposal(proposal);
    setAcceptModalOpen(true);
  };

  const handleConfirmAccept = () => {
    if (!selectedProposal) return;
    acceptApplication(selectedProposal.id, {
      onSuccess: () => {
        toast.success("Proposal accepted! The worker has been assigned.");
        setAcceptModalOpen(false);
        setSelectedProposal(null);
        refetchProposals();
        queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to accept proposal.");
      },
    });
  };

  const handleOpenReject = (proposal: Application) => {
    setSelectedProposal(proposal);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedProposal) return;
    rejectApplication(selectedProposal.id, {
      onSuccess: () => {
        toast.success("Proposal has been rejected.");
        setRejectModalOpen(false);
        setSelectedProposal(null);
        refetchProposals();
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to reject proposal.");
      },
    });
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
          <Users className="text-primary" size={22} />
          Worker Proposals
        </h2>
        <div className="p-8 text-center bg-surface border border-border rounded-sm text-ink-muted">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading submitted proposals...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
          <Users className="text-primary" size={22} />
          Worker Proposals {proposals ? `(${proposals.length})` : ""}
        </h2>
      </div>

      {!proposals?.length ? (
        <EmptyState
          title="No proposals submitted yet"
          description={
            isOpen
              ? "Your job is live on the marketplace. Verified professionals will submit their bids and estimated timelines shortly."
              : "No proposals were submitted for this job."
          }
          icon={<Briefcase size={48} className="text-ink-muted/50" />}
        />
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => {
            const isProposalAccepted = proposal.status === "ACCEPTED";
            const isProposalRejected = proposal.status === "REJECTED";
            const isProposalWithdrawn = proposal.status === "WITHDRAWN";
            const isPending = proposal.status === "PENDING";

            return (
              <div
                key={proposal.id}
                className={`bg-surface p-6 rounded-sm border transition-all ${
                  isProposalAccepted
                    ? "border-success bg-success-light/10"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Worker Info */}
                  <div className="flex gap-4">
                    <Avatar
                      src={
                        proposal.worker?.user?.photoUrl ||
                        proposal.worker?.user?.avatarUrl ||
                        undefined
                      }
                      name={proposal.worker?.user?.name || "Worker"}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-ink text-lg">
                          {proposal.worker?.user?.name ?? "Worker"}
                        </h3>
                        {proposal.worker?.ratingAvg && (
                          <span className="text-xs bg-amber-500/10 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                            ★ {Number(proposal.worker.ratingAvg).toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-sm text-ink-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{proposal.estimatedTime}</span>
                        </span>
                        {proposal.worker?.id && (
                          <Link
                            href={`/worker/${proposal.worker.id}`}
                            className="text-primary hover:underline text-xs font-semibold"
                          >
                            View Profile
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Proposal Price & Actions */}
                  <div className="flex flex-col md:items-end gap-3 shrink-0">
                    <span className="text-2xl font-bold text-ink tabular-nums">
                      {typeof proposal.proposedPrice === "number"
                        ? proposal.proposedPrice.toLocaleString()
                        : proposal.proposedPrice}{" "}
                      ETB
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {isOpen && isPending && (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleOpenReject(proposal)}
                            leftIcon={<X size={14} />}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenAccept(proposal)}
                            leftIcon={<Check size={14} />}
                          >
                            Accept Bid
                          </Button>
                        </>
                      )}

                      {isProposalAccepted && (
                        <Badge
                          variant="success"
                          leftIcon={<CheckCircle2 size={14} />}
                        >
                          Accepted Bid
                        </Badge>
                      )}

                      {isProposalRejected && (
                        <Badge variant="error" leftIcon={<XCircle size={14} />}>
                          Rejected
                        </Badge>
                      )}

                      {isProposalWithdrawn && (
                        <Badge variant="default">Withdrawn</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accept Proposal Modal */}
      <Modal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="Accept Proposal & Hire Worker"
        description="Are you sure you want to accept this proposal? The job will be assigned to this professional."
      >
        {selectedProposal && (
          <div className="my-4 p-4 bg-surface-alt rounded-sm border border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Worker:</span>
              <span className="font-semibold text-ink">
                {selectedProposal.worker?.user?.name || "Professional"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Agreed Price:</span>
              <span className="font-bold text-primary">
                {typeof selectedProposal.proposedPrice === "number"
                  ? selectedProposal.proposedPrice.toLocaleString()
                  : selectedProposal.proposedPrice}{" "}
                ETB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Estimated Delivery:</span>
              <span className="font-semibold text-ink">
                {selectedProposal.estimatedTime}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setAcceptModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmAccept}
            isLoading={isAccepting}
          >
            Confirm & Hire
          </Button>
        </div>
      </Modal>

      {/* Reject Proposal Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Proposal"
        description="Are you sure you want to decline this proposal? The worker will be notified."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmReject}
            isLoading={isRejecting}
          >
            Reject Proposal
          </Button>
        </div>
      </Modal>
    </section>
  );
};
