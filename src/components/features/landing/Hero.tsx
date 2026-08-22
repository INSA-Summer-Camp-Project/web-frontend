import React from "react";
import Link from "next/link";
import { Send, ArrowRight, ShieldCheck } from "lucide-react";
import { StatItem } from "@/types/landing";

export interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = "" }) => {
  return (
    <section
      className={`relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
    >
      {/* Soft subtle tint permitted behind hero per DESIGN.md Section 3 */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary-light/40 to-transparent pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Trust Badge per DESIGN.md Section 12 & C2 */}
        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-3.5 py-1 text-xs font-semibold text-ink-secondary shadow-sm mb-6">
          <ShieldCheck size={14} className="text-primary" />
          <span>Professional & Trustworthy Service Marketplace</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-ink leading-tight mb-6">
          Find help or{" "}
          <span className="text-primary italic">offer services</span>
          <br className="hidden sm:block" /> in your city
        </h1>

        {/* Sub-headline */}
        <p className="section-subtitle max-w-xl mx-auto mb-10 text-base md:text-lg">
          ServiceHub connects you with trusted local professionals — or helps
          you grow your own service business. No passwords, just a quick
          Telegram sign-in.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="btn-primary w-full sm:w-auto text-sm px-6 py-3 rounded-sm shadow-sm hover:shadow-md"
          >
            <Send size={16} />
            <span>Sign up</span>
          </Link>
          <Link
            href="#how-it-works"
            className="btn-secondary w-full sm:w-auto text-sm px-6 py-3 rounded-sm group"
          >
            <span>See how it works</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
