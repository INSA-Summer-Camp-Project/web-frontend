import React from "react";
import Link from "next/link";
import { FooterLinkGroups } from "@/types/landing";

const links: FooterLinkGroups = {
  Platform: ["How It Works", "Services", "For Professionals", "Pricing"],
  Company: ["About Us", "Blog", "Careers", "Press"],
  Support: ["Help Center", "Contact Us", "Safety Tips", "Report an Issue"],
  Legal: ["Terms of Service", "Privacy Policy", "Cookie Policy"],
};

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      className={`border-t border-border bg-surface px-4 sm:px-6 lg:px-8 pt-16 pb-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-serif text-xl font-semibold text-primary"
            >
              ServiceHub
            </Link>
            <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-[180px]">
              Professional & Trustworthy Service Marketplace.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-ink-muted hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-border mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
          <p>
            Powered by{" "}
            <span className="font-semibold text-primary">Telegram</span> for
            secure communication.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
