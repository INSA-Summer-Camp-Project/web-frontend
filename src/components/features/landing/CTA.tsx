import React from "react";
import Link from "next/link";
import { Send, Wrench } from "lucide-react";

export interface CTAProps {
  className?: string;
}

export const CTA: React.FC<CTAProps> = ({ className = "" }) => {
  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{
            background:
              "radial-gradient(ellipse at top, #c4723a22 0%, #f5f0e8 60%), linear-gradient(135deg, #fdfaf5 0%, #f0ebe0 100%)",
            border: "1px solid #e0d5c4",
          }}
        >
          {/* Decorative rings */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-[#e0d5c4] opacity-50 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full border border-[#e0d5c4] opacity-40 pointer-events-none"
          />

          <div className="relative">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-brown mb-4">
              Ready to start?
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c1f14] mb-5 leading-tight">
              Join ServiceHub today
            </h2>
            <p className="text-brand-muted text-lg max-w-md mx-auto mb-10">
              No password. No lengthy forms. Just sign in with Telegram and
              you&apos;re ready to hire or offer services in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup?role=client"
                className="btn-primary w-full sm:w-auto text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg"
              >
                <Send size={18} />I want to hire help
              </Link>
              <Link
                href="/signup?role=professional"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold px-8 py-3.5 rounded-xl border-2 border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white transition-all duration-200"
              >
                <Wrench size={18} />I want to offer services
              </Link>
            </div>

            <p className="text-xs text-brand-muted mt-6">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-brand-brown">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-brand-brown"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
