import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rounded",
  width,
  height,
  className = "",
  style,
  ...props
}) => {
  const variantStyles = {
    text: "rounded-sm h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-sm",
  };

  const inlineStyles: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={`animate-pulse bg-surface-alt border border-border/40 ${variantStyles[variant]} ${className}`}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    />
  );
};
