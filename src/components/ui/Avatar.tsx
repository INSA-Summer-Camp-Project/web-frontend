"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, User } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  verified?: boolean;
  fallbackIcon?: React.ReactNode;
}

const sizeMap: Record<
  AvatarSize,
  {
    container: string;
    text: string;
    pixels: number;
    badgeSize: string;
    badgeIcon: number;
  }
> = {
  xs: {
    container: "w-6 h-6",
    text: "text-[10px]",
    pixels: 24,
    badgeSize: "w-3 h-3 -bottom-0.5 -right-0.5",
    badgeIcon: 8,
  },
  sm: {
    container: "w-8 h-8",
    text: "text-xs",
    pixels: 32,
    badgeSize: "w-3.5 h-3.5 -bottom-0.5 -right-0.5",
    badgeIcon: 9,
  },
  md: {
    container: "w-10 h-10",
    text: "text-sm",
    pixels: 40,
    badgeSize: "w-4 h-4 -bottom-0.5 -right-0.5",
    badgeIcon: 10,
  },
  lg: {
    container: "w-14 h-14",
    text: "text-base",
    pixels: 56,
    badgeSize: "w-5 h-5 bottom-0 right-0",
    badgeIcon: 12,
  },
  xl: {
    container: "w-20 h-20",
    text: "text-xl",
    pixels: 80,
    badgeSize: "w-6 h-6 bottom-0 right-0",
    badgeIcon: 14,
  },
};

function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  verified = false,
  fallbackIcon,
  className = "",
  ...props
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const sizeConfig = sizeMap[size];
  const initials = getInitials(name || alt);
  const showImage = src && !hasImageError;

  return (
    <div className={`relative inline-block shrink-0 ${className}`} {...props}>
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center bg-surface-alt text-ink-muted font-semibold border border-border select-none ${sizeConfig.container} ${sizeConfig.text}`}
      >
        {showImage ? (
          <Image
            src={src}
            alt={alt || name || "Avatar"}
            width={sizeConfig.pixels}
            height={sizeConfig.pixels}
            className="w-full h-full object-cover"
            onError={() => setHasImageError(true)}
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          fallbackIcon || (
            <User size={18} />
          )
        )}
      </div>

      {verified && (
        <div
          data-testid="verified-badge"
          className={`absolute rounded-full bg-success text-white flex items-center justify-center border-2 border-white shadow-xs ${sizeConfig.badgeSize}`}
          title="Verified Professional"
        >
          <Check size={sizeConfig.badgeIcon} strokeWidth={3.5} />
        </div>
      )}
    </div>
  );
};
