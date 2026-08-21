import React from "react";
import { Wrench, Award, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthCardProps {
  children?: React.ReactNode;
  logoIcon?: string | LucideIcon;
  brandName?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-[440px]",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  logoIcon,
  brandName,
  title,
  subtitle,
  footer,
  className,
  maxWidth = "lg",
}) => {
  const maxWidthClass = maxWidthMap[maxWidth] || maxWidthMap.lg;

  const renderIcon = () => {
    if (typeof logoIcon === "function") {
      const IconComponent = logoIcon;
      return <IconComponent size={22} className="stroke-[2.5]" />;
    }
    if (logoIcon === "badge") {
      return <Award size={22} className="stroke-[2.5]" />;
    }
    // Default to Wrench brand icon
    return <Wrench size={22} className="stroke-[2.5]" />;
  };

  return (
    <div
      className={cn(
        "w-full bg-surface shadow-sm rounded-lg border border-border p-5 md:p-6 flex flex-col items-center text-center gap-5 relative z-10 mx-auto",
        maxWidthClass,
        className,
      )}
    >
      {(brandName || logoIcon) && (
        <div className="flex flex-col items-center gap-2 mb-1">
          {logoIcon && (
            <div className="w-12 h-12 rounded-sm bg-primary-light flex items-center justify-center text-primary border border-primary/20 shadow-xs">
              {renderIcon()}
            </div>
          )}
          {brandName && (
            <h1 className="font-serif text-xl font-bold tracking-tight text-ink">
              {brandName}
            </h1>
          )}
        </div>
      )}

      {(title || subtitle) && (
        <div className="flex flex-col gap-1.5 w-full px-2">
          {title && (
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-ink-muted leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}

      {children && <div className="w-full">{children}</div>}

      {footer && (
        <div className="w-full mt-1 pt-3 border-t border-border">{footer}</div>
      )}
    </div>
  );
};
