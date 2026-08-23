import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Navbar,
  Hero,
  HowItWorks,
  Services,
  ForProfessionals,
  Testimonials,
  CTA,
  Footer,
} from "@/components/features/landing";
import LandingPage from "@/app/page";

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
      className,
    }: {
      children: React.ReactNode;
      href: string;
      className?: string;
    }) => (
      <a href={href} className={className}>
        {children}
      </a>
    ),
  };
});

describe("Landing Page Components Test Suite", () => {
  describe("Navbar Component", () => {
    it("renders brand name and navigation links", () => {
      render(<Navbar />);
      expect(screen.getByText("ServiceHub")).toBeInTheDocument();
      expect(screen.getByText("How It Works")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("For Professionals")).toBeInTheDocument();
      expect(screen.getAllByText("Get Started")[0]).toBeInTheDocument();
    });
  });

  describe("Hero Component", () => {
    it("renders headline, badge and CTA buttons", () => {
      render(<Hero />);
      expect(
        screen.getByText(/Professional & Trustworthy Service Marketplace/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Find help or/i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /sign up/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /see how it works/i }),
      ).toBeInTheDocument();
    });
  });

  describe("HowItWorks Component", () => {
    it("renders 4 process steps", () => {
      render(<HowItWorks />);
      expect(screen.getByText("How ServiceHub works")).toBeInTheDocument();
      expect(screen.getByText("Choose your role")).toBeInTheDocument();
      expect(screen.getByText("Browse or get discovered")).toBeInTheDocument();
      expect(screen.getByText("Connect via Telegram")).toBeInTheDocument();
      expect(screen.getByText("Get the job done & rate")).toBeInTheDocument();
    });
  });

  describe("Services Component", () => {
    it("renders service categories", () => {
      render(<Services />);
      expect(screen.getByText("Services we cover")).toBeInTheDocument();
      expect(screen.getByText("Plumbing")).toBeInTheDocument();
      expect(screen.getByText("Electrical")).toBeInTheDocument();
      expect(screen.getByText("Tech Support")).toBeInTheDocument();
    });
  });

  describe("ForProfessionals Component", () => {
    it("renders professional perks and mock profile", () => {
      render(<ForProfessionals />);
      expect(
        screen.getByText("Turn your skills into a steady income"),
      ).toBeInTheDocument();
      expect(screen.getByText("Instant job alerts")).toBeInTheDocument();
      expect(screen.getByText("Ahmed K.")).toBeInTheDocument();
      expect(screen.getByText("Start offering services")).toBeInTheDocument();
    });
  });

  describe("Testimonials Component", () => {
    it("renders testimonials and author initials", () => {
      render(<Testimonials />);
      expect(screen.getByText("Trusted by real people")).toBeInTheDocument();
      expect(screen.getByText("Sara M.")).toBeInTheDocument();
      expect(screen.getByText("Carlos R.")).toBeInTheDocument();
    });
  });

  describe("CTA Component", () => {
    it("renders final call to action buttons", () => {
      render(<CTA />);
      expect(screen.getByText("Join ServiceHub today")).toBeInTheDocument();
      expect(screen.getByText("I want to hire help")).toBeInTheDocument();
      expect(screen.getByText("I want to offer services")).toBeInTheDocument();
    });
  });

  describe("Footer Component", () => {
    it("renders footer brand and categories", () => {
      render(<Footer />);
      expect(screen.getByText("Platform")).toBeInTheDocument();
      expect(screen.getByText("Company")).toBeInTheDocument();
      expect(screen.getByText("Support")).toBeInTheDocument();
      expect(screen.getByText("Legal")).toBeInTheDocument();
    });
  });

  describe("LandingPage Full Assembly", () => {
    it("renders the entire landing page without crashing", () => {
      render(<LandingPage />);
      expect(screen.getByText("Join ServiceHub today")).toBeInTheDocument();
    });
  });
});
