import React from "react";
import Link from "next/link";
import {
  Wrench,
  TrendingUp,
  Bell,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PerkItem } from "@/types/landing";

const perks: PerkItem[] = [
  {
    icon: <Bell size={20} className="text-primary" />,
    title: "Instant job alerts",
    description:
      "Get notified on Telegram the moment a client in your area posts a matching job.",
  },
  {
    icon: <TrendingUp size={20} className="text-primary" />,
    title: "Grow your reputation",
    description:
      "Collect verified reviews and build a profile that wins you more business over time.",
  },
  {
    icon: <ShieldCheck size={20} className="text-primary" />,
    title: "Secure communication",
    description:
      "All client-pro messaging is handled through Telegram — no personal number exposure.",
  },
  {
    icon: <Wrench size={20} className="text-primary" />,
    title: "Zero setup friction",
    description:
      "Sign up once with Telegram, set your skills and location, and start receiving requests immediately.",
  },
];

export interface ForProfessionalsProps {
  className?: string;
}

export const ForProfessionals: React.FC<ForProfessionalsProps> = ({
  className = "",
}) => {
  return (
    <section
      id="professionals"
      className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left – text */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            For Professionals
          </p>
          <h2 className="section-title mb-5">
            Turn your skills into a steady income
          </h2>
          <p className="section-subtitle mb-8">
            Whether you&apos;re a plumber, electrician, hair stylist, or fitness
            trainer — ServiceHub brings clients directly to you through the app
            you already use every day.
          </p>

          <ul className="space-y-5">
            {perks.map((perk) => (
              <li key={perk.title} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-sm bg-primary-light flex items-center justify-center text-primary border border-primary/20">
                  {perk.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-ink text-sm mb-0.5">
                    {perk.title}
                  </h4>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="btn-primary inline-flex text-sm px-6 py-3 rounded-sm shadow-sm hover:shadow-md mt-10 group"
          >
            <span>Start offering services</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Right – visual card */}
        <div className="relative">
          <div className="relative card p-6 md:p-8 rounded-lg space-y-5 shadow-sm border border-border bg-surface">
            {/* Mock profile card */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-serif text-xl font-bold shadow-xs">
                A
              </div>
              <div>
                <p className="font-semibold text-ink">Ahmed K.</p>
                <p className="text-sm text-ink-muted">
                  Licensed Electrician ·{" "}
                  <span className="text-accent font-semibold tabular-nums">
                    4.9 ★
                  </span>
                </p>
              </div>
              <span className="ml-auto text-xs bg-success-light text-success-text font-semibold px-3 py-1 rounded-full">
                Available
              </span>
            </div>

            <hr className="border-border" />

            {/* Job notification mock */}
            <div className="bg-surface-alt rounded-sm p-4 border border-border flex gap-3 items-start">
              <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                <Bell size={15} />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  New Job Request
                </p>
                <p className="text-sm text-ink mt-0.5 font-medium">
                  Panel replacement needed – 2km away
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  Just now · via Telegram
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { v: "142", l: "Jobs done" },
                { v: "98%", l: "Response" },
                { v: "4.9", l: "Rating" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-surface border border-border rounded-sm py-3"
                >
                  <p className="font-serif text-xl font-bold text-primary tabular-nums">
                    {s.v}
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5 font-medium">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForProfessionals;
