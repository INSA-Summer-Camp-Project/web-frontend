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
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-24 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #c4a882 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-16 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a8c4a2 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-card-bg border border-[#e8ddd0] rounded-full px-4 py-1.5 text-xs font-medium text-brand-muted shadow-sm mb-6">
          <ShieldCheck size={13} className="text-brand-brown" />
          Professional & Trustworthy Service Marketplace
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#2c1f14] leading-tight mb-6">
          Find help or{" "}
          <span className="text-brand-brown italic">offer services</span>
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
            className="btn-primary w-full sm:w-auto text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg"
          >
            <Send size={18} />
            Sign up with Telegram
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 text-sm font-medium text-[#5a4a3a] hover:text-brand-brown transition-colors group"
          >
            See how it works
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
              <span className="font-serif text-3xl font-bold text-brand-brown">
                {stat.value}
              </span>
              <span className="text-sm text-brand-muted mt-0.5">
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
