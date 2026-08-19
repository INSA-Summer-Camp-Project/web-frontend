import React from "react";
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

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-ink">
        <Hero />
        <HowItWorks />
        <Services />
        <ForProfessionals />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
