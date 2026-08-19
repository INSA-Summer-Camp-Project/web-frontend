import React from "react";
import {
  Wrench,
  Paintbrush,
  Zap,
  Scissors,
  Truck,
  Laptop,
  Home,
  ChefHat,
  Dumbbell,
  Camera,
  BookOpen,
  Car,
} from "lucide-react";
import { ServiceItem } from "@/types/landing";

const services: ServiceItem[] = [
  { icon: <Wrench size={22} />, label: "Plumbing" },
  { icon: <Zap size={22} />, label: "Electrical" },
  { icon: <Paintbrush size={22} />, label: "Painting" },
  { icon: <Scissors size={22} />, label: "Beauty & Hair" },
  { icon: <Truck size={22} />, label: "Moving & Delivery" },
  { icon: <Laptop size={22} />, label: "Tech Support" },
  { icon: <Home size={22} />, label: "Cleaning" },
  { icon: <ChefHat size={22} />, label: "Catering" },
  { icon: <Dumbbell size={22} />, label: "Personal Training" },
  { icon: <Camera size={22} />, label: "Photography" },
  { icon: <BookOpen size={22} />, label: "Tutoring" },
  { icon: <Car size={22} />, label: "Auto Repair" },
];

export interface ServicesProps {
  className?: string;
}

export const Services: React.FC<ServicesProps> = ({ className = "" }) => {
  return (
    <section
      id="services"
      className={`py-24 px-4 sm:px-6 lg:px-8 bg-surface-alt/40 border-y border-border/60 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Categories
          </p>
          <h2 className="section-title mb-4">Services we cover</h2>
          <p className="section-subtitle max-w-lg mx-auto">
            From home repairs to personal care — find a professional for
            virtually any need in your area.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {services.map((svc) => (
            <button
              key={svc.label}
              type="button"
              className="card flex flex-col items-center gap-3 py-6 hover:-translate-y-0.5 cursor-pointer group text-center"
            >
              <div className="w-12 h-12 rounded-sm bg-surface-alt flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-150">
                {svc.icon}
              </div>
              <span className="text-sm font-medium text-ink">{svc.label}</span>
            </button>
          ))}
        </div>

        {/* Browse all */}
        <div className="text-center mt-10">
          <p className="text-sm text-ink-muted">
            And <span className="font-semibold text-primary">50+ more</span>{" "}
            categories available on the platform.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
