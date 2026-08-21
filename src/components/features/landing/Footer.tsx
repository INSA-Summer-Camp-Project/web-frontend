"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { FooterLinkGroups } from "@/types/landing";
import {
  TermsOfServiceModal,
  PrivacyPolicyModal,
} from "@/components/features/legal";

// Static link groups — Legal is handled separately because two of its
// items open modals instead of navigating to a route.
const staticLinks: FooterLinkGroups = {
  Platform: ["How It Works", "Services", "For Professionals", "Pricing"],
  Company: ["About Us", "Blog", "Careers", "Press"],
  Support: ["Help Center", "Contact Us", "Safety Tips", "Report an Issue"],
};

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
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

      <footer
        className={`border-t border-border bg-surface px-4 sm:px-6 lg:px-8 pt-16 pb-8 ${className}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2.5 group inline-flex mb-3"
              >
                <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
                  <Wrench size={16} className="stroke-[2.5]" />
                </div>
                <span className="font-serif text-xl font-semibold text-ink tracking-tight group-hover:text-primary transition-colors">
                  ServiceHub
                </span>
              </Link>
              <p className="text-sm text-ink-muted leading-relaxed max-w-[180px]">
                Professional & Trustworthy Service Marketplace.
              </p>
            </div>

            {/* Platform, Company, Support — plain navigation links */}
            {Object.entries(staticLinks).map(([group, items]) => (
              <div key={group}>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                  {group}
                </p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-ink-muted hover:text-primary transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Legal — Terms and Privacy open modals; Cookie Policy is a plain link */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                Legal
              </p>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsOpen(true);
                    }}
                    className="text-sm text-ink-muted hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPrivacyOpen(true);
                    }}
                    className="text-sm text-ink-muted hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-ink-muted hover:text-primary transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-border mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
            <p>
              © {new Date().getFullYear()} ServiceHub. All rights reserved.
            </p>
            <p>
              Powered by{" "}
              <span className="font-semibold text-primary">Telegram</span> for
              secure communication.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
