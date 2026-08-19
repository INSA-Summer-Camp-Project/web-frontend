import React from "react";
import { Search, UserCheck, MessageCircle, Star } from "lucide-react";
import { StepItem } from "@/types/landing";

const steps: StepItem[] = [
  {
    icon: <UserCheck size={22} className="text-primary" />,
    step: "01",
    title: "Choose your role",
    description:
      "Sign up as a client looking for help, or as a professional ready to offer your services.",
  },
  {
    icon: <Search size={22} className="text-primary" />,
    step: "02",
    title: "Browse or get discovered",
    description:
      "Clients browse verified professionals by category and location. Pros get matched with nearby customers automatically.",
  },
  {
    icon: <MessageCircle size={22} className="text-primary" />,
    step: "03",
    title: "Connect via Telegram",
    description:
      "All communication happens through Telegram — fast, private, and no extra app needed. No password to remember.",
  },
  {
    icon: <Star size={22} className="text-primary" />,
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
      className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
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
            <div key={s.step} className="card relative group p-6">
              {/* Step number */}
              <span className="absolute top-5 right-5 font-serif text-3xl md:text-4xl font-bold text-border group-hover:text-border-strong transition-colors select-none">
                {s.step}
              </span>

              {/* Icon */}
              <div className="w-11 h-11 rounded-sm bg-primary-light flex items-center justify-center mb-4 text-primary border border-primary/20">
                {s.icon}
              </div>

              <h3 className="font-serif text-lg font-semibold text-ink mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
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
