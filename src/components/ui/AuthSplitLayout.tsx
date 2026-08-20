import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Wrench } from "lucide-react";

export interface AuthSplitLayoutProps {
  children: React.ReactNode;
  brandTitle?: string;
  brandSubtitle?: string;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  children,
  brandTitle = "ServiceHub",
  brandSubtitle = "Trusted services, connected.",
}) => {
  return (
    <div className="flex w-full min-h-screen bg-surface">
      {/* Left Panel - Visual/Brand (Hidden on mobile/tablet, visible on desktop) */}
      <div className="hidden lg:flex flex-col relative w-[45%] bg-primary-dark overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/auth-bg.jpg"
            alt="Trusted local services"
            fill
            className="object-cover opacity-80"
            priority
          />
          {/* Subtle gradient overlay to ensure text readability and branding */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-primary/20 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col p-12 h-full justify-between">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center text-primary shadow-sm">
              <Wrench size={22} className="stroke-[2.5]" />
            </div>
            <span className="font-serif text-2xl font-bold text-white tracking-tight group-hover:text-white/90 transition-colors">
              {brandTitle}
            </span>
          </Link>

          <div className="mt-auto">
            <h1 className="text-white font-serif text-4xl leading-tight font-medium max-w-md">
              {brandSubtitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication (Full width on mobile, 55% on desktop) */}
      <div className="flex flex-col flex-1 lg:w-[55%] relative overflow-y-auto bg-surface">
        {/* Mobile Header (Hidden on desktop) */}
        <div className="lg:hidden w-full p-6 flex justify-center border-b border-border bg-white">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
              <Wrench size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-serif text-xl font-bold text-ink tracking-tight">
              {brandTitle}
            </span>
          </Link>
        </div>

        {/* Auth Content Wrapper */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 w-full">
          <div className="w-full max-w-[440px] mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
