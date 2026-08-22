"use client";

import React, { useState } from "react";
import {
  Plus,
  Award,
  ExternalLink,
  Trash2,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CertificateUploadModal } from "./CertificateUploadModal";
import { useAddCertificate, useDeleteCertificate } from "@/hooks/useWorker";
import type { Certificate, AddCertificatePayload } from "@/types";

export interface CertificatesSectionProps {
  certificates?: Certificate[];
  className?: string;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates = [],
  className = "",
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);

  const addCertMutation = useAddCertificate();
  const deleteCertMutation = useDeleteCertificate();

  const handleAddCertificate = async (payload: AddCertificatePayload) => {
    try {
      await addCertMutation.mutateAsync(payload);
      toast.success("Certificate uploaded successfully!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload certificate.";
      toast.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    if (!certToDelete) return;
    try {
      await deleteCertMutation.mutateAsync(certToDelete.id);
      toast.success("Certificate removed.");
      setCertToDelete(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete certificate.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div
        className={`bg-surface border border-border rounded-md p-6 shadow-xs space-y-5 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">
              Certifications & Accreditations
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Verified certifications prove professional training and trade
              mastery.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Add Certificate
          </Button>
        </div>

        {certificates.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border rounded-md bg-surface-alt/20 space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
              <Award size={20} />
            </div>
            <p className="text-sm font-semibold text-ink">
              No certifications uploaded yet
            </p>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Upload vocational certificates, licenses, or course completions to
              receive a verified profile badge.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                leftIcon={<Plus size={14} />}
              >
                Upload First Certificate
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {certificates.map((cert) => {
              const fileUrl = cert.fileUrl || "";
              const issueDate = cert.issuedDate;
              const formattedDate = issueDate
                ? new Date(issueDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : undefined;

              return (
                <div
                  key={cert.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border border-border bg-surface-alt/30 hover:bg-surface-alt/60 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-md bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={20} />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-sm font-bold text-ink truncate">
                        {cert.title}
                      </h3>

                      {formattedDate && (
                        <span className="flex items-center gap-1 text-xs text-ink-muted">
                          <Calendar size={12} />
                          <span>Issued {formattedDate}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-ink-secondary hover:text-primary hover:bg-surface border border-border transition-colors"
                      >
                        <ExternalLink size={13} />
                        <span>View Document</span>
                      </a>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCertToDelete(cert)}
                      aria-label={`Delete ${cert.title}`}
                      className="text-ink-muted hover:text-error hover:bg-error-light/30"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Upload Modal */}
      <CertificateUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleAddCertificate}
        isLoading={addCertMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!certToDelete}
        onClose={() => setCertToDelete(null)}
        title="Delete Certificate?"
        description="Are you sure you want to remove this certificate from your profile?"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setCertToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              isLoading={deleteCertMutation.isPending}
              onClick={handleConfirmDelete}
            >
              Delete Certificate
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Certificate:{" "}
          <span className="font-semibold text-ink">{certToDelete?.title}</span>
        </p>
      </Modal>
    </>
  );
};
