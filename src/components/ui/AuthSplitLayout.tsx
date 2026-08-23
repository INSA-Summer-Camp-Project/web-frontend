import React from "react";
import Image from "next/image";
import Link from "next/link";

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
      <div className="hidden lg:flex flex-col relative w-[45%] bg-white overflow-hidden">
        {/* Background Image - Blue Logo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/logo-package/logo-blue.svg"
            alt="Trusted local services"
            fill
            className="object-cover opacity-100"
            priority
          />
        </div>

        {/* Content - Layer 1 (Primary blue text for white background areas) */}
        <div className="relative z-10 flex flex-col p-12 h-full justify-between">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-14 h-14 rounded-sm bg-white flex items-center justify-center p-2 shadow-sm border border-border relative overflow-hidden">
              <Image
                src="/logo-package/logo-blue.svg"
                alt="ServiceHub Logo"
                width={42}
                height={42}
                className="w-full h-full object-contain transition-opacity duration-200 group-hover:opacity-0"
                priority
              />
              <Image
                src="/logo-package/logo-black.svg"
                alt="ServiceHub Logo Hover"
                width={42}
                height={42}
                className="w-full h-full object-contain absolute p-2 inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                priority
              />
            </div>
            <span className="font-serif text-2xl font-bold text-black group-hover:text-primary tracking-tight transition-colors">
              {brandTitle}
            </span>
          </Link>

          <div className="mt-auto">
            <h1 className="text-primary font-serif text-4xl leading-tight font-bold max-w-md">
              {brandSubtitle}
            </h1>
          </div>
        </div>

        {/* Content - Layer 2 (White text clipped strictly to the blue logo shape area) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none bg-[#2563EB]"
          style={{
            WebkitMaskImage: "url('/logo-package/logo-blue.svg')",
            WebkitMaskSize: "cover",
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            maskImage: "url('/logo-package/logo-blue.svg')",
            maskSize: "cover",
            maskPosition: "center",
            maskRepeat: "no-repeat",
          }}
        >
          <div className="flex flex-col p-12 h-full justify-between">
            <div className="flex items-center gap-3 w-fit">
              <div className="w-14 h-14 rounded-sm bg-white flex items-center justify-center p-2 shadow-sm border border-border relative overflow-hidden">
                <Image
                  src="/logo-package/logo-blue.svg"
                  alt="ServiceHub Logo"
                  width={42}
                  height={42}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                {brandTitle}
              </span>
            </div>

            <div className="mt-auto">
              <h1 className="text-white font-serif text-4xl leading-tight font-bold max-w-md">
                {brandSubtitle}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication (Full width on mobile, 55% on desktop) */}
      <div className="flex flex-col flex-1 lg:w-[55%] relative overflow-y-auto bg-surface">
        {/* Mobile Header (Hidden on desktop) */}
        <div className="lg:hidden w-full p-6 flex justify-center border-b border-border bg-white">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-12 h-12 relative flex items-center justify-center overflow-hidden">
              <Image
                src="/logo-package/logo-blue.svg"
                alt="ServiceHub Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain transition-opacity duration-200 group-hover:opacity-0"
                priority
              />
              <Image
                src="/logo-package/logo-black.svg"
                alt="ServiceHub Logo Hover"
                width={44}
                height={44}
                className="w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                priority
              />
            </div>
            <span className="font-serif text-xl font-bold text-black group-hover:text-primary tracking-tight transition-colors">
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
