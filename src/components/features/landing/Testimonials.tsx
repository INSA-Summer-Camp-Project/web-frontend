import React from "react";
import { Star } from "lucide-react";
import { TestimonialItem } from "@/types/landing";
import { cn } from "@/lib/utils";

const testimonials: TestimonialItem[] = [
  {
    name: "Sara M.",
    role: "Homeowner",
    initials: "SM",
    rating: 5,
    text: "Found a plumber in under 10 minutes. He arrived the same afternoon and fixed the leak perfectly. ServiceHub is a game changer for busy people.",
  },
  {
    name: "Carlos R.",
    role: "Freelance Electrician",
    initials: "CR",
    rating: 5,
    text: "I was skeptical at first, but I've gotten 15 new clients in my first month. The Telegram integration is brilliant — I never miss a job alert.",
  },
  {
    name: "Nadia H.",
    role: "Hair Stylist",
    initials: "NH",
    rating: 5,
    text: "Running my own bookings used to be a nightmare. Now clients find me on ServiceHub and we coordinate everything on Telegram. So simple.",
  },
  {
    name: "Tom B.",
    role: "Property Manager",
    initials: "TB",
    rating: 5,
    text: "We use ServiceHub for all maintenance jobs across our properties. Verified professionals, fast response, and reviews I can actually trust.",
  },
];

interface StarsProps {
  count: number;
}

const Stars: React.FC<StarsProps> = ({ count }) => {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-accent text-accent" />
      ))}
    </div>
  );
};

export interface TestimonialsProps {
  className?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ className }) => {
  return (
    <section
      id="testimonials"
      className={cn(
        "py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-surface-alt/40 border-y border-border/60",
        className,
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Testimonials
          </p>
          <h2 className="section-title mb-4">Trusted by real people</h2>
          <p className="section-subtitle max-w-md mx-auto">
            Hear from clients and professionals who use ServiceHub every day.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="card flex flex-col gap-4 p-6 rounded-md"
            >
              {/* Stars */}
              <Stars count={t.rating} />

              {/* Quote */}
              <blockquote className="text-sm text-ink-secondary leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Author */}
              <figcaption className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 shadow-xs">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
