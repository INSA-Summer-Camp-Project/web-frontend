"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, Wrench } from "lucide-react";
import {
  TermsOfServiceModal,
  PrivacyPolicyModal,
} from "@/components/features/legal";

export interface CTAProps {
  className?: string;
}

export const CTA: React.FC<CTAProps> = ({ className = "" }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <section className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-lg p-10 md:p-14 text-center bg-surface border border-border shadow-sm">
            <div className="relative">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">
                Ready to start?
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-ink mb-5 leading-tight">
                Join ServiceHub today
              </h2>
              <p className="text-ink-muted text-base md:text-lg max-w-md mx-auto mb-10">
                No password. No lengthy forms. Just sign in with Telegram and
                you&apos;re ready to hire or offer services in minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup?role=client"
                  className="btn-primary w-full sm:w-auto text-sm px-6 py-3 rounded-sm shadow-sm hover:shadow-md"
                >
                  <Send size={16} />
                  <span>I want to hire help</span>
                </Link>
                <Link
                  href="/signup?role=professional"
                  className="btn-secondary w-full sm:w-auto text-sm px-6 py-3 rounded-sm"
                >
                  <Wrench size={16} />
                  <span>I want to offer services</span>
                </Link>
              </div>

              <p className="text-xs text-ink-muted mt-8">
                By signing up, you agree to our{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTermsOpen(true);
                  }}
                  className="underline hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPrivacyOpen(true);
                  }}
                  className="underline hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;
