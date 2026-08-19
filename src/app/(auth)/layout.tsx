"use client";

import React from "react";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background text-ink antialiased relative overflow-hidden">
        {/* Soft subtle primary tint per DESIGN.md Section 3 */}
        <div
          className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary-light/40 rounded-full filter blur-3xl opacity-30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Header Navigation */}
        <header className="w-full top-0 bg-background/80 backdrop-blur-sm flex justify-between items-center h-16 px-4 md:px-8 max-w-7xl mx-auto relative z-20 border-b border-border/60">
          <Link
            href="/"
            className="font-serif text-xl md:text-2xl font-semibold text-primary flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[28px]">
              build_circle
            </span>
            <span>ServiceHub</span>
          </Link>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-12 relative z-10">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="py-4 text-center text-xs text-ink-muted relative z-20 border-t border-border/40">
          &copy; {new Date().getFullYear()} ServiceHub. All rights reserved.
        </footer>
      </div>
    </AuthProvider>
  );
}
