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
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#e8ddd0_0%,#f5f0e8_40%,#dde8e0_100%)] text-[#2c1f14]">
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
