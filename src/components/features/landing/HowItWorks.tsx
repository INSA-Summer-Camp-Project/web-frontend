import React from "react";
import { Search, UserCheck, MessageCircle, Star } from "lucide-react";
import { StepItem } from "@/types/landing";

const steps: StepItem[] = [
  {
    icon: <UserCheck size={24} className="text-brand-brown" />,
    step: "01",
    title: "Choose your role",
    description:
      "Sign up as a client looking for help, or as a professional ready to offer your services.",
  },
  {
    icon: <Search size={24} className="text-brand-brown" />,
    step: "02",
    title: "Browse or get discovered",
    description:
      "Clients browse verified professionals by category and location. Pros get matched with nearby customers automatically.",
  },
  {
    icon: <MessageCircle size={24} className="text-brand-brown" />,
    step: "03",
    title: "Connect via Telegram",
    description:
      "All communication happens through Telegram — fast, private, and no extra app needed. No password to remember.",
  },
  {
    icon: <Star size={24} className="text-brand-brown" />,
    step: "04",
    title: "Get the job done & rate",
    description:
      "Complete the service, leave a review, and build your reputation on the platform.",
  },
];

export interface HowItWorksProps {
  className?: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ className = "" }) => {
  return (
    <section
      id="how-it-works"
      className={`py-24 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-brown mb-3">
            Simple Process
          </p>
          <h2 className="section-title mb-4">How ServiceHub works</h2>
          <p className="section-subtitle max-w-lg mx-auto">
            From sign-up to getting things done in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="card relative group">
              {/* Step number */}
              <span className="absolute top-5 right-5 font-serif text-4xl font-bold text-[#e8ddd0] group-hover:text-[#d9cfc4] transition-colors select-none">
                {s.step}
              </span>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#f0ebe0] flex items-center justify-center mb-4">
                {s.icon}
              </div>

              <h3 className="font-serif text-lg font-semibold text-[#2c1f14] mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
