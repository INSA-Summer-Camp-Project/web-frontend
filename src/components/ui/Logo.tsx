import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  variant?: "blue" | "black" | "white";
  size?: number;
  showText?: boolean;
  textClassName?: string;
  className?: string;
  href?: string;
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "blue",
  size = 42,
  showText = true,
  textClassName = "",
  className = "",
  href = "/",
  subtitle,
}) => {
  const logoSrc =
    variant === "white"
      ? "/logo-package/logo-white.svg"
      : variant === "black"
        ? "/logo-package/logo-black.svg"
        : "/logo-package/logo-blue.svg";

  const hoverLogoSrc = "/logo-package/logo-black.svg";

  const content = (
    <div
      className={cn("flex items-center gap-2.5 group select-none", className)}
    >
      <div
        className="relative shrink-0 flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src={logoSrc}
          alt="ServiceHub Logo"
          width={size}
          height={size}
          className="object-contain w-full h-full transition-opacity duration-200 group-hover:opacity-0"
          priority
        />
        {variant !== "black" && (
          <Image
            src={hoverLogoSrc}
            alt="ServiceHub Logo Hover"
            width={size}
            height={size}
            className="object-contain w-full h-full absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            priority
          />
        )}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-serif text-xl font-bold tracking-tight transition-colors",
              variant === "white"
                ? "text-white group-hover:text-white/90"
                : "text-black group-hover:text-primary",
              textClassName,
            )}
          >
            ServiceHub
          </span>
          {subtitle && (
            <span className="text-[10px] font-semibold text-black uppercase tracking-wider -mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
