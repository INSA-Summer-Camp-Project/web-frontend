"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { uploadImage } from "@/lib/cloudinary";

export interface PortfolioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    title: string;
    description?: string;
    imageUrl: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

export const PortfolioUploadModal: React.FC<PortfolioUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
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

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for your portfolio project.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select an image file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(
        selectedFile,
        "servicehub/portfolio",
      );
      await onUpload({
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl: uploadedUrl,
      });
      handleClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to upload portfolio image.";
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
      title="Add Portfolio Project"
      description="Showcase previous work to build credibility with customers."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <Input
            id="portfolio-title"
            label="Project Title"
            placeholder="e.g. Modern Bathroom Remodel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isBusy}
          />
        </div>

        {/* Description Textarea */}
        <div>
          <Textarea
            id="portfolio-description"
            label="Project Description (Optional)"
            placeholder="Describe the problem, materials used, and final result..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={isBusy}
          />
        </div>

        {/* Image File Picker & Preview */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
            Project Image
          </label>

          {previewUrl ? (
            <div className="relative rounded-md overflow-hidden border border-border bg-surface-alt aspect-video max-h-52 w-full flex items-center justify-center">
              <Image
                src={previewUrl}
                alt="Selected project preview"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={isBusy}
                aria-label="Remove image"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
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
                <ImageIcon size={20} />
              </div>
              <span className="text-sm font-semibold text-ink">
                Click to upload project photo
              </span>
              <span className="text-xs text-ink-muted mt-0.5">
                PNG, JPG, or WEBP (Max 5MB)
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
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
            {isUploading ? "Uploading..." : "Save Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
