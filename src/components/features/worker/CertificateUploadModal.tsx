"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileText, Award } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { uploadDocument } from "@/lib/cloudinary";

export interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    title: string;
    issueDate: string;
    fileUrl: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

export const CertificateUploadModal: React.FC<CertificateUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setTitle("");
    setIssueDate("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF document or an image (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter the certification name/title.");
      return;
    }

    if (!issueDate) {
      toast.error("Please select the date this certificate was issued.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a document or image file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadDocument(
        selectedFile,
        "servicehub/certificates",
      );
      await onUpload({
        title: title.trim(),
        issueDate,
        fileUrl: uploadedUrl,
      });
      handleClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to upload certificate document.";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isLoading || isUploading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Professional Certificate"
      description="Upload certificates, licenses, or diplomas to earn a verified badge."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Certificate Title */}
        <div>
          <Input
            id="certificate-title"
            label="Certificate / Qualification Title"
            placeholder="e.g. Certified Electrician Level IV"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isBusy}
          />
        </div>

        {/* Issue Date */}
        <div>
          <Input
            id="certificate-issue-date"
            type="date"
            label="Issued Date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
            disabled={isBusy}
          />
        </div>

        {/* Document / Image File Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
            Certificate File
          </label>

          {selectedFile ? (
            <div className="flex items-center justify-between p-3.5 rounded-md border border-border bg-surface-alt/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-sm bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-ink truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={isBusy}
                aria-label="Remove certificate file"
                className="p-1 rounded-full text-ink-muted hover:text-error hover:bg-error-light/40 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/60 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface-alt/30 hover:bg-surface-alt/60"
            >
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center mb-2">
                <Award size={20} />
              </div>
              <span className="text-sm font-semibold text-ink">
                Click to upload certificate document
              </span>
              <span className="text-xs text-ink-muted mt-0.5">
                PDF, PNG, JPG (Max 10MB)
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isBusy}
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={isBusy}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isBusy}
            leftIcon={<Upload size={16} />}
          >
            {isUploading ? "Uploading..." : "Save Certificate"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
