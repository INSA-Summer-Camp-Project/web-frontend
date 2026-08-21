"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  LegalSectionBlock,
  TERMS_INTRO,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from "./LegalContent";

export interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service"
      description={`Last updated: ${TERMS_LAST_UPDATED}`}
      maxWidth="xl"
      footer={
        <Button variant="primary" size="md" onClick={onClose}>
          Got it
        </Button>
      }
    >
      {/* Intro paragraph */}
      <p className="text-sm text-ink-secondary leading-relaxed mb-6 pb-5 border-b border-border">
        {TERMS_INTRO}
      </p>

      {/* Numbered sections */}
      {TERMS_SECTIONS.map((section, i) => (
        <LegalSectionBlock key={section.heading} section={section} index={i} />
      ))}
    </Modal>
  );
};
