"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/types/landing";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/stores/authStore";

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
  const user = useAuthStore((state) => state.user);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Logo variant="blue" size={36} href="/" />

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
          {user ? (
            <Link
              href={`/${user.lastActiveRole?.toLowerCase() || "customer"}/dashboard`}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                <img
                  src={
                    user.photoUrl ||
                    user.avatarUrl ||
                    "https://ui-avatars.com/api/?name=" +
                      user.name +
                      "&background=0D8ABC&color=fff"
                  }
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-ink-secondary group-hover:text-primary transition-colors">
                Dashboard
              </span>
            </Link>
          ) : (
            <>
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
            </>
          )}
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
