import React from "react";

export interface AuthCardProps {
  children?: React.ReactNode;
  logoIcon?: string;
  brandName?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-[420px]",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  logoIcon = "handyman",
  brandName,
  title,
  subtitle,
  footer,
  className = "",
  maxWidth = "lg",
}) => {
  const maxWidthClass = maxWidthMap[maxWidth] || maxWidthMap.lg;

  return (
    <div
      className={`w-full ${maxWidthClass} bg-surface shadow-sm rounded-lg border border-border p-6 md:p-8 flex flex-col items-center text-center gap-6 relative z-10 mx-auto ${className}`}
    >
      {(brandName || logoIcon) && (
        <div className="flex flex-col items-center gap-1 mb-1">
          {logoIcon && (
            <div className="w-12 h-12 rounded-sm bg-surface-alt flex items-center justify-center mb-2 text-primary border border-border">
              <span className="material-symbols-outlined text-[24px]">
                {logoIcon}
              </span>
            </div>
          )}
          {brandName && (
            <h1 className="text-lg font-bold tracking-tight text-ink">
              {brandName}
            </h1>
          )}
        </div>
      )}

      {(title || subtitle) && (
        <div className="flex flex-col gap-1 w-full px-2">
          {title && (
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-ink-muted mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children && <div className="w-full">{children}</div>}

      {footer && (
        <div className="w-full mt-2 pt-4 border-t border-border">{footer}</div>
      )}
    </div>
  );
};
