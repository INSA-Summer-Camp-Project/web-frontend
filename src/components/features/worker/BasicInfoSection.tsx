"use client";

import React, { useState, useRef } from "react";
import { Camera, Save, DollarSign, Clock } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { uploadImage } from "@/lib/cloudinary";
import { useUpdateWorkerProfile } from "@/hooks/useWorker";
import type { WorkerProfile, UpdateWorkerProfilePayload } from "@/types";

export interface BasicInfoSectionProps {
  profile?: WorkerProfile;
  onUpdate?: (payload: UpdateWorkerProfilePayload) => Promise<void> | void;
  className?: string;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  profile,
  onUpdate,
  className = "",
}) => {
  const updateMutation = useUpdateWorkerProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState(profile?.bio || "");
  const [experienceYears, setExperienceYears] = useState<number | string>(
    profile?.experienceYears ?? "",
  );
  const [paymentRate, setPaymentRate] = useState<number | string>(
    profile?.paymentRate ?? "",
  );
  const [profilePhoto, setProfilePhoto] = useState(
    profile?.profilePhoto || "",
  );
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo size must be less than 5MB.");
      return;
    }

    try {
      setIsPhotoUploading(true);
      const photoUrl = await uploadImage(file, "servicehub/avatars");
      setProfilePhoto(photoUrl);
      toast.success("Profile photo uploaded!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload photo.";
      toast.error(errorMessage);
    } finally {
      setIsPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateWorkerProfilePayload = {
      bio: bio.trim() || undefined,
      experienceYears:
        experienceYears !== "" ? Number(experienceYears) : undefined,
      paymentRate: paymentRate !== "" ? Number(paymentRate) : undefined,
      profilePhoto: profilePhoto || undefined,
    };

    try {
      if (onUpdate) {
        await onUpdate(payload);
      } else {
        await updateMutation.mutateAsync(payload);
      }
      toast.success("Profile information updated successfully!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile.";
      toast.error(errorMessage);
    }
  };

  const isSaving = updateMutation.isPending || isPhotoUploading;

  return (
    <div
      className={`bg-surface border border-border rounded-md p-6 shadow-xs space-y-6 ${className}`}
    >
      <div className="border-b border-border pb-4">
        <h2 className="font-serif text-lg font-bold text-ink">
          Basic Profile Information
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Manage your personal details, biography, hourly rate, and experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Row */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-md bg-surface-alt/40 border border-border">
          <div className="relative group">
            <Avatar
              src={profilePhoto}
              name={profile?.user?.name || "Worker"}
              size="xl"
              className="border-2 border-primary/20"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              aria-label="Upload profile photo"
              className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            >
              <Camera size={20} />
              <span className="text-[10px] font-medium mt-0.5">Change</span>
            </button>
          </div>

          <div className="flex flex-col text-center sm:text-left space-y-1">
            <span className="text-sm font-bold text-ink">Profile Avatar</span>
            <span className="text-xs text-ink-muted">
              JPG, PNG, or WEBP (Max 5MB). Professional headshots increase
              booking rates by 40%.
            </span>
            <div className="pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
                isLoading={isPhotoUploading}
                leftIcon={<Camera size={14} />}
              >
                {profilePhoto ? "Upload New Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={isSaving}
          />
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="experienceYears"
              type="number"
              min="0"
              max="50"
              label="Years of Experience"
              placeholder="e.g. 5"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              leftIcon={<Clock size={16} />}
              disabled={isSaving}
            />
          </div>

          <div>
            <Input
              id="paymentRate"
              type="number"
              min="0"
              step="any"
              label="Starting / Hourly Rate (ETB)"
              placeholder="e.g. 350"
              value={paymentRate}
              onChange={(e) => setPaymentRate(e.target.value)}
              leftIcon={<DollarSign size={16} />}
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Bio Textarea */}
        <div>
          <Textarea
            id="bio"
            label="Professional Biography"
            placeholder="Describe your background, core specialties, customer satisfaction guarantees, and tools..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            disabled={isSaving}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3 border-t border-border">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save size={16} />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
