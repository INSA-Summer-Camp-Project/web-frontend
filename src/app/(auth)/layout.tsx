"use client";

import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
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

        {/* Top Header Navigation per DESIGN.md W1 - Full width background container */}
        <header className="w-full top-0 bg-white/90 backdrop-blur-md border-b border-border relative z-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
                <Wrench size={18} className="stroke-[2.5]" />
              </div>
              <span className="font-serif text-xl font-semibold text-ink tracking-tight group-hover:text-primary transition-colors">
                ServiceHub
              </span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-12 relative z-10">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="w-full py-4 text-center text-xs text-ink-muted relative z-20 border-t border-border bg-white/50">
          &copy; {new Date().getFullYear()} ServiceHub. All rights reserved.
        </footer>
      </div>
    </AuthProvider>
  );
}
