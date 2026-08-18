"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/types/landing";

const navLinks: NavLink[] = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "For Professionals", href: "#professionals" },
  { label: "Testimonials", href: "#testimonials" },
];

export interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8]/80 backdrop-blur-md border-b border-[#e8ddd0] ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-xs text-brand-muted-light">·</span>
          <span className="font-serif text-xl font-semibold text-brand-brown tracking-tight group-hover:opacity-80 transition-opacity">
            ServiceHub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-[#5a4a3a] hover:text-brand-brown transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[#5a4a3a] hover:text-brand-brown transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm px-5 py-2.5 rounded-lg"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#5a4a3a] hover:text-brand-brown transition-colors"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#fdfaf5] border-t border-[#e8ddd0] px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-[#5a4a3a] hover:text-brand-brown py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-[#e8ddd0]" />
          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/login"
              className="text-sm font-medium text-center text-[#5a4a3a] py-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-sm rounded-lg py-2.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
