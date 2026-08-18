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
    icon: <Bell size={20} className="text-brand-brown" />,
    title: "Instant job alerts",
    description:
      "Get notified on Telegram the moment a client in your area posts a matching job.",
  },
  {
    icon: <TrendingUp size={20} className="text-brand-brown" />,
    title: "Grow your reputation",
    description:
      "Collect verified reviews and build a profile that wins you more business over time.",
  },
  {
    icon: <ShieldCheck size={20} className="text-brand-brown" />,
    title: "Secure communication",
    description:
      "All client-pro messaging is handled through Telegram — no personal number exposure.",
  },
  {
    icon: <Wrench size={20} className="text-brand-brown" />,
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
      className={`py-24 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left – text */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-brown mb-3">
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
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#f0ebe0] flex items-center justify-center">
                  {perk.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-[#2c1f14] text-sm mb-0.5">
                    {perk.title}
                  </h4>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 mt-10 text-sm font-semibold text-brand-brown hover:text-brand-brown-hover group transition-colors"
          >
            Start offering services
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Right – visual card */}
        <div className="relative">
          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at bottom left, #dde8e0 0%, #f5f0e8 60%)",
            }}
          />

          <div className="relative card p-8 rounded-3xl space-y-5">
            {/* Mock profile card */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-brown flex items-center justify-center text-white font-serif text-xl font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-[#2c1f14]">Ahmed K.</p>
                <p className="text-sm text-brand-muted">
                  Licensed Electrician · 4.9 ★
                </p>
              </div>
              <span className="ml-auto text-xs bg-green-100 text-green-700 font-medium px-2.5 py-1 rounded-full">
                Available
              </span>
            </div>

            <hr className="border-[#e8ddd0]" />

            {/* Job notification mock */}
            <div className="bg-[#f0ebe0] rounded-xl p-4 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-brand-brown flex items-center justify-center flex-shrink-0">
                <Bell size={15} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-brown uppercase tracking-wide">
                  New Job Request
                </p>
                <p className="text-sm text-[#3d2b1f] mt-0.5">
                  Panel replacement needed – 2km away
                </p>
                <p className="text-xs text-brand-muted mt-1">
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
                  className="bg-[#fdfaf5] border border-[#e8ddd0] rounded-xl py-3"
                >
                  <p className="font-serif text-xl font-bold text-brand-brown">
                    {s.v}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">{s.l}</p>
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
