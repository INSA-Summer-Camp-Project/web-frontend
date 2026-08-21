"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  LegalSectionBlock,
  PRIVACY_INTRO,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
} from "./LegalContent";

export interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      description={`Last updated: ${PRIVACY_LAST_UPDATED}`}
      maxWidth="xl"
      footer={
        <Button variant="primary" size="md" onClick={onClose}>
          Got it
        </Button>
      }
    >
      {/* Intro paragraph */}
      <p className="text-sm text-ink-secondary leading-relaxed mb-6 pb-5 border-b border-border">
        {PRIVACY_INTRO}
      </p>

      {/* Numbered sections */}
      {PRIVACY_SECTIONS.map((section, i) => (
        <LegalSectionBlock key={section.heading} section={section} index={i} />
      ))}
    </Modal>
  );
};
