"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Wrench } from "lucide-react";
import { NavLink } from "@/types/landing";

const navLinks: NavLink[] = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "For Professionals", href: "#professionals" },
];

export interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
            <Wrench size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-serif text-xl font-semibold text-ink tracking-tight group-hover:text-primary transition-colors">
            ServiceHub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-secondary hover:text-primary transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-ink-secondary hover:text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/login"
            className="btn-primary text-sm px-4 py-2 rounded-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-ink-secondary hover:text-primary transition-colors cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-border px-4 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-ink-secondary hover:text-primary py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-border" />
          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/login"
              className="text-sm font-medium text-center text-ink-secondary py-2"
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="btn-primary text-sm rounded-sm py-2.5 text-center block"
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
