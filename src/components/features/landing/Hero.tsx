import React from "react";
import Link from "next/link";
import { Send, ArrowRight, ShieldCheck } from "lucide-react";
import { StatItem } from "@/types/landing";

const stats: StatItem[] = [
  { value: "10,000+", label: "Active Professionals" },
  { value: "50+", label: "Service Categories" },
  { value: "4.9★", label: "Average Rating" },
];

export interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = "" }) => {
  return (
    <section
      className={`relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
    >
      {/* Soft subtle tint permitted behind hero per DESIGN.md Section 3 */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary-light/30 to-transparent pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-xs font-medium text-ink-secondary shadow-sm mb-6">
          <ShieldCheck size={14} className="text-primary" />
          <span>Professional & Trustworthy Service Marketplace</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-ink leading-tight mb-6">
          Find help or{" "}
          <span className="text-primary italic">offer services</span>
          <br className="hidden sm:block" /> in your city
        </h1>

        {/* Sub-headline */}
        <p className="section-subtitle max-w-xl mx-auto mb-10">
          ServiceHub connects you with trusted local professionals — or helps
          you grow your own service business. No passwords, just a quick
          Telegram sign-in.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="btn-primary w-full sm:w-auto text-base px-8 py-3.5 rounded-sm shadow-sm"
          >
            <Send size={18} />
            <span>Sign up with Telegram</span>
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-primary transition-colors group"
          >
            <span>See how it works</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-serif text-3xl font-bold text-primary tabular-nums">
                {stat.value}
              </span>
              <span className="text-sm text-ink-muted mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
