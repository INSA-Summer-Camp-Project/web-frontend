"use client";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-ink antialiased">
      <main className="grow flex w-full h-full relative">{children}</main>
    </div>
  );
}
